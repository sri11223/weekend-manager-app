import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Share2, Download, Camera, Link, Mail, MessageCircle } from 'lucide-react';
import { useWeekendStore } from '../../store/useWeekendStore';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

export const ShareExport: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { currentPlan } = useWeekendStore();

  const generatePlanImage = async (): Promise<string> => {
    const planElement = document.getElementById('weekend-plan-export');
    if (!planElement || !currentPlan) return '';

    // Create a temporary element for export
    const exportElement = document.createElement('div');
    exportElement.id = 'temp-export';
    exportElement.className = 'bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8 rounded-2xl';
    exportElement.innerHTML = `
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
          ${currentPlan.name}
        </h1>
        <p class="text-gray-600">My Weekend Plan • ${currentPlan.activities.length} Activities</p>
      </div>
      
      <div class="grid grid-cols-2 gap-6">
        ${['saturday', 'sunday'].map(day => `
          <div class="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg rounded-2xl p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4 capitalize">${day}</h2>
            <div class="space-y-3">
              ${currentPlan.activities
                .filter(a => a.day === day)
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map(activity => `
                  <div class="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                    <span class="text-2xl">${activity.icon}</span>
                    <div class="flex-1">
                      <h3 class="font-medium text-gray-900">${activity.name}</h3>
                      <p class="text-sm text-gray-600">${activity.startTime} • ${activity.duration}min</p>
                    </div>
                  </div>
                `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="text-center mt-8">
        <p class="text-sm text-gray-500">Created with Weekendly ✨</p>
      </div>
    `;

    document.body.appendChild(exportElement);

    try {
      const canvas = await html2canvas(exportElement, {
        backgroundColor: '#f8fafc',
        scale: 2,
        useCORS: true,
      });
      
      document.body.removeChild(exportElement);
      return canvas.toDataURL('image/png');
    } catch (error) {
      document.body.removeChild(exportElement);
      throw error;
    }
  };

  const handleDownloadImage = async () => {
    if (!currentPlan) return;
    
    setIsGenerating(true);
    try {
      const imageData = await generatePlanImage();
      const link = document.createElement('a');
      link.download = `${currentPlan.name.replace(/\s+/g, '-').toLowerCase()}-plan.png`;
      link.href = imageData;
      link.click();
      toast.success('Plan image downloaded!');
    } catch (error) {
      toast.error('Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!currentPlan) return;
    
    setIsGenerating(true);
    try {
      const imageData = await generatePlanImage();
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = 297;
      
      pdf.addImage(imageData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${currentPlan.name.replace(/\s+/g, '-').toLowerCase()}-plan.pdf`);
      toast.success('Plan PDF downloaded!');
    } catch (error) {
      toast.error('Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    if (!currentPlan) return;
    
    const planData = encodeURIComponent(JSON.stringify({
      name: currentPlan.name,
      activities: currentPlan.activities.map(a => ({
        name: a.name,
        day: a.day,
        startTime: a.startTime,
        duration: a.duration,
        icon: a.icon
      }))
    }));
    
    const shareUrl = `${window.location.origin}?plan=${planData}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Plan link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleShareSocial = async (platform: string) => {
    if (!currentPlan) return;
    
    const text = `Check out my weekend plan: ${currentPlan.name}! ${currentPlan.activities.length} amazing activities planned. Created with Weekendly ✨`;
    const url = window.location.href;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent('My Weekend Plan')}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  const handleNativeShare = async () => {
    if (!currentPlan) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentPlan.name,
          text: `Check out my weekend plan with ${currentPlan.activities.length} activities!`,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or sharing failed
      }
    } else {
      handleCopyLink();
    }
  };

  if (!currentPlan) {
    return (
      <Card>
        <div className="text-center py-8 text-gray-500">
          <Share2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Create a plan to enable sharing</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Share2 className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold gradient-text">Share & Export</h3>
        </div>
        <p className="text-gray-600 text-sm">
          Share your weekend plan with friends or save it for later
        </p>
      </div>

      <div className="space-y-6">
        {/* Download Options */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Download</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleDownloadImage}
              disabled={isGenerating}
              className="flex items-center space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>{isGenerating ? 'Generating...' : 'Download Image'}</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
            </Button>
          </div>
        </div>

        {/* Share Link */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Share Link</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="flex items-center space-x-2"
            >
              <Link className="w-4 h-4" />
              <span>Copy Link</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleNativeShare}
              className="flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </Button>
          </div>
        </div>

        {/* Social Sharing */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Share on Social</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShareSocial('twitter')}
              className="flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Twitter</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShareSocial('facebook')}
              className="flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Facebook</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShareSocial('whatsapp')}
              className="flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShareSocial('email')}
              className="flex items-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </Button>
          </div>
        </div>

        {/* Plan Preview */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Plan Preview</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>{currentPlan.name}</strong></p>
            <p>{currentPlan.activities.length} activities planned</p>
            <p>Theme: {currentPlan.theme}</p>
            <p>Created: {new Date(currentPlan.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
