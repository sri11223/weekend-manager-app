import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Download, Image, Facebook, Twitter, Instagram, Copy, Check, Sparkles, Heart, Sun, Moon, X } from 'lucide-react'
import { useScheduleStore } from '../../store/scheduleStore'
import { useTheme } from '../../hooks/useTheme'
import { format } from 'date-fns'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface ShareExportPanelProps {
  onClose?: () => void
}

export const ShareExportPanel: React.FC<ShareExportPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'share' | 'export'>('share')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const posterRef = useRef<HTMLDivElement>(null)
  const { scheduledActivities } = useScheduleStore()
  const { currentTheme } = useTheme()

  const generateShareableLink = () => {
    try {
      const planData = {
        activities: scheduledActivities.map(activity => ({
          id: activity.id,
          name: activity.name,
          day: activity.day,
          startTime: activity.startTime,
          duration: activity.duration,
          cost: activity.cost
        })),
        timestamp: Date.now()
      }
      const encodedData = encodeURIComponent(JSON.stringify(planData))
      return `${window.location.origin}/shared-plan/${encodedData}`
    } catch (error) {
      console.error('Error generating shareable link:', error)
      return `${window.location.origin}`
    }
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
      // Temporarily move the poster element to be visible for capture
      const posterElement = posterRef.current
      posterElement.style.position = 'fixed'
      posterElement.style.left = '0px'
      posterElement.style.top = '0px'
      posterElement.style.zIndex = '9999'
      
      // Wait a moment for styles to apply
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const canvas = await html2canvas(posterElement, {
        backgroundColor: currentTheme.colors.background,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: true,
        width: 1080,
        height: 1350,
        logging: false
      })
      
      // Move it back to hidden position
      posterElement.style.position = 'fixed'
      posterElement.style.left = '-9999px'
      posterElement.style.top = '0px'
      posterElement.style.zIndex = '1'
      
      const link = document.createElement('a')
      link.download = `${currentTheme.name.toLowerCase()}-weekend-plan-${format(new Date(), 'yyyy-MM-dd')}.png`
      link.href = canvas.toDataURL('image/png', 1.0)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
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

  const exportToPDF = async () => {
    if (!posterRef.current) return
    setIsGenerating(true)
    try {
      // Temporarily move the poster element to be visible for capture
      const posterElement = posterRef.current
      posterElement.style.position = 'fixed'
      posterElement.style.left = '0px'
      posterElement.style.top = '0px'
      posterElement.style.zIndex = '9999'
      
      // Wait a moment for styles to apply
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const canvas = await html2canvas(posterElement, {
        backgroundColor: currentTheme.colors.background,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: true,
        width: 1080,
        height: 1350,
        logging: false
      })
      
      // Move it back to hidden position
      posterElement.style.position = 'fixed'
      posterElement.style.left = '-9999px'
      posterElement.style.top = '0px'
      posterElement.style.zIndex = '1'
      
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgData = canvas.toDataURL('image/png', 1.0)
      
      // Calculate dimensions to fit the poster nicely on A4
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgAspectRatio = canvas.width / canvas.height
      const pdfAspectRatio = pdfWidth / pdfHeight
      
      let imgWidth, imgHeight, xOffset, yOffset
      
      if (imgAspectRatio > pdfAspectRatio) {
        // Image is wider, fit to width
        imgWidth = pdfWidth - 20 // 10mm margin on each side
        imgHeight = imgWidth / imgAspectRatio
        xOffset = 10
        yOffset = (pdfHeight - imgHeight) / 2
      } else {
        // Image is taller, fit to height
        imgHeight = pdfHeight - 20 // 10mm margin on top/bottom
        imgWidth = imgHeight * imgAspectRatio
        xOffset = (pdfWidth - imgWidth) / 2
        yOffset = 10
      }
      
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight)
      pdf.save(`${currentTheme.name.toLowerCase()}-weekend-plan-${format(new Date(), 'yyyy-MM-dd')}.pdf`)
    } catch (error) {
      console.error('Failed to generate PDF:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
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
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
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

      {/* Beautiful Theme-Based Poster Template */}
      <div 
        ref={posterRef} 
        className="fixed -left-[9999px] w-[1080px] h-[1350px] overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.colors.primary}15, ${currentTheme.colors.secondary}15, ${currentTheme.colors.accent}10)`,
          fontFamily: 'Inter, system-ui, sans-serif',
          backgroundColor: currentTheme.colors.background
        }}
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full" style={{ backgroundColor: currentTheme.colors.primary }}></div>
          <div className="absolute top-40 right-32 w-24 h-24 rounded-full" style={{ backgroundColor: currentTheme.colors.accent }}></div>
          <div className="absolute bottom-32 left-32 w-28 h-28 rounded-full" style={{ backgroundColor: currentTheme.colors.secondary }}></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 rounded-full" style={{ backgroundColor: currentTheme.colors.primary }}></div>
        </div>

        {/* Header Section */}
        <div className="relative z-10 text-center pt-12 pb-8 px-12">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center mb-4">
              {currentTheme.id === 'energetic' && <Sun className="w-16 h-16 mr-4" style={{ color: currentTheme.colors.primary }} />}
              {currentTheme.id === 'lazy' && <Moon className="w-16 h-16 mr-4" style={{ color: currentTheme.colors.primary }} />}
              {currentTheme.id === 'adventurous' && <Sparkles className="w-16 h-16 mr-4" style={{ color: currentTheme.colors.primary }} />}
              <div className="text-left">
                <h1 className="text-5xl font-black leading-tight" style={{ color: currentTheme.colors.primary }}>
                  My {currentTheme.name}
                </h1>
                <h1 className="text-5xl font-black" style={{ color: currentTheme.colors.primary }}>
                  Weekend
                </h1>
              </div>
            </div>
            
            <div className="flex items-center justify-center mb-4">
              <Heart className="w-5 h-5 mr-2" style={{ color: currentTheme.colors.accent }} />
              <p className="text-xl font-semibold" style={{ color: currentTheme.colors.text }}>
                {format(new Date(), 'MMMM d, yyyy')}
              </p>
            </div>
            
            {/* Theme Quote */}
            <div className="max-w-xl mx-auto">
              <p className="text-lg italic font-medium" style={{ color: currentTheme.colors.textSecondary }}>
                {currentTheme.id === 'energetic' && '"Life is meant to be lived with energy and passion!"'}
                {currentTheme.id === 'lazy' && '"Sometimes the most productive thing you can do is relax."'}
                {currentTheme.id === 'adventurous' && '"Adventure awaits those who dare to explore!"'}
              </p>
            </div>
          </div>
        </div>

        {/* Activities Section */}
        <div className="px-12 pb-12">
          {/* Weekend Overview Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div 
              className="text-center p-4 rounded-2xl"
              style={{ backgroundColor: `${currentTheme.colors.primary}15` }}
            >
              <div className="text-3xl font-black mb-1" style={{ color: currentTheme.colors.primary }}>
                {scheduledActivities.length}
              </div>
              <div className="text-sm font-semibold" style={{ color: currentTheme.colors.text }}>
                Activities
              </div>
            </div>
            <div 
              className="text-center p-4 rounded-2xl"
              style={{ backgroundColor: `${currentTheme.colors.accent}15` }}
            >
              <div className="text-3xl font-black mb-1" style={{ color: currentTheme.colors.accent }}>
                ${scheduledActivities.reduce((sum, activity) => sum + (Number(activity.cost) || 0), 0)}
              </div>
              <div className="text-sm font-semibold" style={{ color: currentTheme.colors.text }}>
                Budget
              </div>
            </div>
            <div 
              className="text-center p-4 rounded-2xl"
              style={{ backgroundColor: `${currentTheme.colors.secondary}15` }}
            >
              <div className="text-3xl font-black mb-1" style={{ color: currentTheme.colors.secondary }}>
                {Math.floor(scheduledActivities.reduce((sum, activity) => sum + activity.duration, 0) / 60)}h
              </div>
              <div className="text-sm font-semibold" style={{ color: currentTheme.colors.text }}>
                Duration
              </div>
            </div>
          </div>

          {/* Timeline Layout */}
          <div className="space-y-8">
            {['saturday', 'sunday'].map(day => {
              const dayActivities = scheduledActivities.filter(activity => activity.day === day)
              return (
                <div key={day} className="space-y-4">
                  {/* Day Header */}
                  <div className="flex items-center justify-center mb-6">
                    <div 
                      className="px-8 py-3 rounded-full text-white font-bold text-xl uppercase tracking-wider shadow-lg"
                      style={{ backgroundColor: currentTheme.colors.primary }}
                    >
                      {day}
                    </div>
                  </div>

                  {/* Activities Timeline */}
                  <div className="space-y-3">
                    {dayActivities.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-lg" style={{ color: currentTheme.colors.textSecondary }}>
                          No activities planned
                        </p>
                      </div>
                    ) : (
                      dayActivities
                        .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))
                        .map((activity, index) => (
                          <div 
                            key={activity.id} 
                            className="flex items-center gap-4 p-4 rounded-xl shadow-md"
                            style={{
                              backgroundColor: `${currentTheme.colors.surface}f0`,
                              borderLeft: `4px solid ${currentTheme.colors.accent}`
                            }}
                          >
                            {/* Time */}
                            <div 
                              className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-sm"
                              style={{ backgroundColor: currentTheme.colors.accent }}
                            >
                              {activity.startTime}
                            </div>

                            {/* Activity Content */}
                            <div className="flex-1">
                              <h3 className="text-lg font-bold mb-1" style={{ color: currentTheme.colors.text }}>
                                {activity.name}
                              </h3>
                              <p className="text-sm mb-2 leading-relaxed" style={{ color: currentTheme.colors.textSecondary }}>
                                {activity.description}
                              </p>
                              
                              {/* Activity Details */}
                              <div className="flex items-center space-x-3 text-xs font-medium">
                                <span 
                                  className="px-2 py-1 rounded-full"
                                  style={{ 
                                    backgroundColor: `${currentTheme.colors.primary}20`,
                                    color: currentTheme.colors.primary 
                                  }}
                                >
                                  {activity.duration}min
                                </span>
                                <span 
                                  className="px-2 py-1 rounded-full"
                                  style={{ 
                                    backgroundColor: `${currentTheme.colors.secondary}20`,
                                    color: currentTheme.colors.secondary 
                                  }}
                                >
                                  ${activity.cost}
                                </span>
                              </div>
                            </div>

                            {/* Activity Number */}
                            <div 
                              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                              style={{ backgroundColor: currentTheme.colors.primary }}
                            >
                              {index + 1}
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="w-5 h-5" style={{ color: currentTheme.colors.accent }} />
            <p className="text-lg font-medium" style={{ color: currentTheme.colors.textSecondary }}>
              Created with Weekendly
            </p>
            <Sparkles className="w-5 h-5" style={{ color: currentTheme.colors.accent }} />
          </div>
        </div>
      </div>
      </motion.div>
    </div>
  )
}

export default ShareExportPanel
