import React, { useState } from 'react'
import { X, Users, Send, UserPlus, Calendar, MessageCircle, Check, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

interface SocialPlanningProps {
  onClose: () => void
}

interface Collaborator {
  id: string
  name: string
  email: string
  avatar: string
  status: 'pending' | 'accepted' | 'declined'
  lastSeen: string
}

interface PlanningSession {
  id: string
  title: string
  participants: Collaborator[]
  createdAt: string
  status: 'active' | 'completed' | 'scheduled'
}

const MOCK_COLLABORATORS: Collaborator[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: '/api/placeholder/40/40',
    status: 'accepted',
    lastSeen: '2 min ago'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@example.com',
    avatar: '/api/placeholder/40/40',
    status: 'pending',
    lastSeen: '1 hour ago'
  },
  {
    id: '3',
    name: 'Emma Davis',
    email: 'emma@example.com',
    avatar: '/api/placeholder/40/40',
    status: 'accepted',
    lastSeen: 'Online'
  }
]

const MOCK_SESSIONS: PlanningSession[] = [
  {
    id: '1',
    title: 'Weekend Beach Trip Planning',
    participants: MOCK_COLLABORATORS.slice(0, 2),
    createdAt: '2024-09-10',
    status: 'active'
  },
  {
    id: '2',
    title: 'Birthday Party Weekend',
    participants: MOCK_COLLABORATORS,
    createdAt: '2024-09-08',
    status: 'completed'
  }
]

const SocialPlanning: React.FC<SocialPlanningProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'collaborate' | 'sessions' | 'invites'>('collaborate')
  const [newInviteEmail, setNewInviteEmail] = useState('')
  const [collaborators, setCollaborators] = useState(MOCK_COLLABORATORS)
  const [sessions, setSessions] = useState(MOCK_SESSIONS)
  const [message, setMessage] = useState('')

  const handleInvite = () => {
    if (newInviteEmail.trim()) {
      const newCollaborator: Collaborator = {
        id: Date.now().toString(),
        name: newInviteEmail.split('@')[0],
        email: newInviteEmail,
        avatar: '/api/placeholder/40/40',
        status: 'pending',
        lastSeen: 'Just invited'
      }
      setCollaborators([...collaborators, newCollaborator])
      setNewInviteEmail('')
    }
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      // In real app, this would send message to collaborators
      console.log('Sending message:', message)
      setMessage('')
    }
  }

  const startNewSession = () => {
    const newSession: PlanningSession = {
      id: Date.now().toString(),
      title: 'New Weekend Planning Session',
      participants: collaborators.filter(c => c.status === 'accepted'),
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active'
    }
    setSessions([newSession, ...sessions])
    setActiveTab('sessions')
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
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <Users className="w-6 h-6 mr-2" />
                Social Planning
              </h2>
              <p className="text-white/80 mt-1">Plan your weekend together with friends and family</p>
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
              { id: 'collaborate', label: 'Collaborate', icon: Users },
              { id: 'sessions', label: 'Sessions', icon: Calendar },
              { id: 'invites', label: 'Invites', icon: UserPlus }
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
          {activeTab === 'collaborate' && (
            <div className="space-y-6">
              {/* Active Collaborators */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Collaborators</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {collaborators.filter(c => c.status === 'accepted').map((collaborator) => (
                    <div key={collaborator.id} className="bg-gray-50 rounded-xl p-4 flex items-center space-x-3">
                      <img
                        src={collaborator.avatar}
                        alt={collaborator.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{collaborator.name}</h4>
                        <p className="text-sm text-gray-600">{collaborator.email}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-xs text-gray-500">{collaborator.lastSeen}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-time Chat */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Planning Chat</h3>
                <div className="bg-white rounded-lg p-4 h-40 overflow-y-auto mb-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <img src="/api/placeholder/32/32" alt="Sarah" className="w-8 h-8 rounded-full" />
                      <div>
                        <div className="bg-blue-100 text-blue-900 px-3 py-2 rounded-lg text-sm">
                          Hey! What do you think about going to the beach this weekend?
                        </div>
                        <span className="text-xs text-gray-500 mt-1">Sarah • 2 min ago</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 justify-end">
                      <div>
                        <div className="bg-indigo-500 text-white px-3 py-2 rounded-lg text-sm">
                          Sounds great! I'll check the weather forecast.
                        </div>
                        <span className="text-xs text-gray-500 mt-1 text-right block">You • 1 min ago</span>
                      </div>
                      <img src="/api/placeholder/32/32" alt="You" className="w-8 h-8 rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex space-x-4">
                <button
                  onClick={startNewSession}
                  className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors flex items-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Start New Planning Session</span>
                </button>
                <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Share Current Plan</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Planning Sessions</h3>
                <button
                  onClick={startNewSession}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors text-sm"
                >
                  New Session
                </button>
              </div>

              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">{session.title}</h4>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        session.status === 'active' ? 'bg-green-100 text-green-700' :
                        session.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {session.status}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex -space-x-2">
                        {session.participants.slice(0, 3).map((participant) => (
                          <img
                            key={participant.id}
                            src={participant.avatar}
                            alt={participant.name}
                            className="w-8 h-8 rounded-full border-2 border-white"
                          />
                        ))}
                        {session.participants.length > 3 && (
                          <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{session.participants.length - 3}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">
                        {session.participants.length} participant{session.participants.length !== 1 ? 's' : ''}
                      </span>
                      <span className="text-sm text-gray-500">Created {session.createdAt}</span>
                    </div>

                    <div className="flex space-x-3">
                      <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors text-sm">
                        Join Session
                      </button>
                      <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'invites' && (
            <div className="space-y-6">
              {/* Send Invites */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Invite Collaborators</h3>
                <div className="flex space-x-3 mb-4">
                  <input
                    type="email"
                    value={newInviteEmail}
                    onChange={(e) => setNewInviteEmail(e.target.value)}
                    placeholder="Enter email address..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleInvite}
                    className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors flex items-center space-x-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Invite</span>
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Invite friends and family to collaborate on your weekend plans in real-time.
                </p>
              </div>

              {/* Pending Invites */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Invites</h3>
                <div className="space-y-3">
                  {collaborators.filter(c => c.status === 'pending').map((collaborator) => (
                    <div key={collaborator.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={collaborator.avatar}
                          alt={collaborator.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{collaborator.name}</h4>
                          <p className="text-sm text-gray-600">{collaborator.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 text-yellow-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">Pending</span>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 text-sm">
                          Resend
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SocialPlanning
