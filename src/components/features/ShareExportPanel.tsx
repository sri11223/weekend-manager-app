import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Download, Image, Facebook, Twitter, Instagram, Copy, Check } from 'lucide-react'
import { useWeekendStore } from '../../store/weekendStore'
import { format } from 'date-fns'
import html2canvas from 'html2canvas'

interface ShareExportPanelProps {
  onClose?: () => void
}

export const ShareExportPanel: React.FC<ShareExportPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'share' | 'export'>('share')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const posterRef = useRef<HTMLDivElement>(null)
  const { scheduledActivities } = useWeekendStore()

  const generateShareableLink = () => {
    const planData = {
      activities: scheduledActivities,
      timestamp: Date.now()
    }
    const encodedData = btoa(JSON.stringify(planData))
    return `${window.location.origin}/shared-plan/${encodedData}`
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const generatePoster = async () => {
    if (!posterRef.current) return

    setIsGenerating(true)
    try {
      const canvas = await html2canvas(posterRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true
      })
      
      const link = document.createElement('a')
      link.download = `weekend-plan-${format(new Date(), 'yyyy-MM-dd')}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error('Failed to generate poster:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const shareToSocial = (platform: string) => {
    const shareText = `Check out my awesome weekend plan! 🌟 ${scheduledActivities.length} activities planned for the perfect weekend.`
    const shareUrl = generateShareableLink()
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      instagram: shareUrl // Instagram doesn't support direct sharing, so we'll copy the link
    }
    
    if (platform === 'instagram') {
      copyToClipboard(shareUrl)
    } else {
      window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400')
    }
  }

  const exportToPDF = () => {
    // In a real implementation, you would use a library like jsPDF
    // For now, we'll simulate the export
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Weekend Plan</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .activity { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
              .day { font-weight: bold; color: #333; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>My Weekend Plan</h1>
              <p>${format(new Date(), 'MMMM d, yyyy')}</p>
            </div>
            ${scheduledActivities.map(activity => `
              <div class="activity">
                <div class="day">${activity.day.toUpperCase()} - ${activity.timeSlot}</div>
                <h3>${activity.title}</h3>
                <p>${activity.description}</p>
                <p><strong>Duration:</strong> ${activity.duration} minutes | <strong>Cost:</strong> $${activity.cost}</p>
              </div>
            `).join('')}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-lg w-full overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Share2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Share & Export</h3>
              <p className="text-sm text-gray-500">Share your weekend plan with friends</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex mt-4 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('share')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'share'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Share
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'export'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Export
          </button>
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'share' && (
            <motion.div
              key="share"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Share Link */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Share Link</span>
                  <button
                    onClick={() => copyToClipboard(generateShareableLink())}
                    className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700"
                  >
                    {copySuccess ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="text-xs text-gray-500 bg-white p-2 rounded border break-all">
                  {generateShareableLink()}
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Share on Social Media</h4>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => shareToSocial('twitter')}
                    className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg flex flex-col items-center gap-2 transition-colors"
                  >
                    <Twitter className="w-5 h-5 text-blue-500" />
                    <span className="text-xs text-gray-600">Twitter</span>
                  </button>
                  <button
                    onClick={() => shareToSocial('facebook')}
                    className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg flex flex-col items-center gap-2 transition-colors"
                  >
                    <Facebook className="w-5 h-5 text-blue-600" />
                    <span className="text-xs text-gray-600">Facebook</span>
                  </button>
                  <button
                    onClick={() => shareToSocial('instagram')}
                    className="p-3 bg-pink-50 hover:bg-pink-100 rounded-lg flex flex-col items-center gap-2 transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-pink-500" />
                    <span className="text-xs text-gray-600">Instagram</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'export' && (
            <motion.div
              key="export"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Export Options */}
              <div className="space-y-3">
                <button
                  onClick={generatePoster}
                  disabled={isGenerating || scheduledActivities.length === 0}
                  className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-300 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Image className="w-4 h-4" />
                  )}
                  Generate Poster
                </button>

                <button
                  onClick={exportToPDF}
                  disabled={scheduledActivities.length === 0}
                  className="w-full p-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 disabled:text-gray-400 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export as PDF
                </button>
              </div>

              {/* Preview */}
              <div className="text-center text-sm text-gray-500">
                <p>{scheduledActivities.length} activities ready to export</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden Poster Template */}
      <div ref={posterRef} className="fixed -left-[9999px] w-[800px] bg-white p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Weekend Plan</h1>
          <p className="text-xl text-gray-600">{format(new Date(), 'MMMM d, yyyy')}</p>
        </div>
        
        <div className="space-y-6">
          {['saturday', 'sunday'].map(day => (
            <div key={day}>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize">{day}</h2>
              <div className="space-y-4">
                {scheduledActivities
                  .filter(activity => activity.day === day)
                  .map(activity => (
                    <div key={activity.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                        <span className="text-sm text-gray-500">{activity.timeSlot}</span>
                      </div>
                      <p className="text-gray-600 mb-2">{activity.description}</p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{activity.duration} minutes</span>
                        <span>${activity.cost}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default ShareExportPanel
