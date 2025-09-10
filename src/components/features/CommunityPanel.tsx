import React, { useState } from 'react'
import { X, Users, Heart, Share2, MessageCircle, Bookmark, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

interface CommunityPanelProps {
  onClose: () => void
}

interface CommunityPlan {
  id: string
  title: string
  author: string
  avatar: string
  likes: number
  comments: number
  tags: string[]
  activities: string[]
  image: string
  isLiked: boolean
  isBookmarked: boolean
}

const TRENDING_PLANS: CommunityPlan[] = [
  {
    id: '1',
    title: 'Perfect Romantic Weekend in the City',
    author: 'Sarah Chen',
    avatar: '/api/placeholder/40/40',
    likes: 234,
    comments: 18,
    tags: ['romantic', 'city', 'food'],
    activities: ['Fine Dining', 'Art Gallery', 'Sunset Walk', 'Wine Tasting'],
    image: '/api/placeholder/300/200',
    isLiked: false,
    isBookmarked: true
  },
  {
    id: '2',
    title: 'Adventure Seeker\'s Mountain Escape',
    author: 'Mike Rodriguez',
    avatar: '/api/placeholder/40/40',
    likes: 189,
    comments: 25,
    tags: ['adventure', 'outdoor', 'hiking'],
    activities: ['Mountain Hiking', 'Rock Climbing', 'Camping', 'Stargazing'],
    image: '/api/placeholder/300/200',
    isLiked: true,
    isBookmarked: false
  },
  {
    id: '3',
    title: 'Family Fun Weekend Activities',
    author: 'Jessica Park',
    avatar: '/api/placeholder/40/40',
    likes: 156,
    comments: 12,
    tags: ['family', 'kids', 'indoor'],
    activities: ['Museum Visit', 'Mini Golf', 'Movie Night', 'Board Games'],
    image: '/api/placeholder/300/200',
    isLiked: false,
    isBookmarked: false
  },
  {
    id: '4',
    title: 'Foodie\'s Paradise Tour',
    author: 'David Kim',
    avatar: '/api/placeholder/40/40',
    likes: 298,
    comments: 34,
    tags: ['food', 'local', 'culture'],
    activities: ['Food Market', 'Cooking Class', 'Street Food', 'Brewery Tour'],
    image: '/api/placeholder/300/200',
    isLiked: true,
    isBookmarked: true
  }
]

const CommunityPanel: React.FC<CommunityPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'trending' | 'following' | 'my-plans'>('trending')
  const [plans, setPlans] = useState(TRENDING_PLANS)

  const handleLike = (planId: string) => {
    setPlans(plans.map(plan => 
      plan.id === planId 
        ? { ...plan, isLiked: !plan.isLiked, likes: plan.isLiked ? plan.likes - 1 : plan.likes + 1 }
        : plan
    ))
  }

  const handleBookmark = (planId: string) => {
    setPlans(plans.map(plan => 
      plan.id === planId 
        ? { ...plan, isBookmarked: !plan.isBookmarked }
        : plan
    ))
  }

  const handleUsePlan = (plan: CommunityPlan) => {
    // Add plan activities to user's weekend
    console.log('Using plan:', plan.title)
    // Implementation would integrate with weekend store
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <Users className="w-6 h-6 mr-2" />
                Community Plans
              </h2>
              <p className="text-white/80 mt-1">Discover and share amazing weekend ideas</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mt-4">
            {[
              { id: 'trending', label: 'Trending', icon: TrendingUp },
              { id: 'following', label: 'Following', icon: Users },
              { id: 'my-plans', label: 'My Plans', icon: Bookmark }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === id
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 h-[calc(100%-140px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={plan.image}
                    alt={plan.title}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => handleBookmark(plan.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                      plan.isBookmarked
                        ? 'bg-yellow-500 text-white'
                        : 'bg-white/80 text-gray-600 hover:bg-white'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{plan.title}</h3>
                  
                  {/* Author */}
                  <div className="flex items-center space-x-2 mb-3">
                    <img
                      src={plan.avatar}
                      alt={plan.author}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-gray-600">{plan.author}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {plan.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Activities Preview */}
                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-700 mb-2">Activities:</div>
                    <div className="text-sm text-gray-600">
                      {plan.activities.slice(0, 3).join(' • ')}
                      {plan.activities.length > 3 && ` +${plan.activities.length - 3} more`}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLike(plan.id)}
                        className={`flex items-center space-x-1 text-sm transition-colors ${
                          plan.isLiked
                            ? 'text-red-500'
                            : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${plan.isLiked ? 'fill-current' : ''}`} />
                        <span>{plan.likes}</span>
                      </button>
                      
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <MessageCircle className="w-4 h-4" />
                        <span>{plan.comments}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleUsePlan(plan)}
                        className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Use Plan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CommunityPanel
