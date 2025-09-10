import React, { useState, useEffect } from 'react'
import { X, DollarSign, PieChart, TrendingUp, AlertCircle, Calculator } from 'lucide-react'
import { motion } from 'framer-motion'
import { useWeekendStore } from '../../store/weekendStore'

interface BudgetTrackerProps {
  onClose: () => void
}

interface BudgetCategory {
  id: string
  name: string
  budgeted: number
  spent: number
  color: string
}

const BudgetTracker: React.FC<BudgetTrackerProps> = ({ onClose }) => {
  const { activities } = useWeekendStore()
  const [totalBudget, setTotalBudget] = useState(200)
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: 'food', name: 'Food & Dining', budgeted: 80, spent: 0, color: 'bg-orange-500' },
    { id: 'entertainment', name: 'Entertainment', budgeted: 60, spent: 0, color: 'bg-purple-500' },
    { id: 'outdoor', name: 'Outdoor Activities', budgeted: 40, spent: 0, color: 'bg-green-500' },
    { id: 'transport', name: 'Transportation', budgeted: 20, spent: 0, color: 'bg-blue-500' }
  ])

  useEffect(() => {
    // Calculate spent amounts from activities
    const categorySpending = activities.reduce((acc, activity) => {
      const category = activity.category || 'entertainment'
      acc[category] = (acc[category] || 0) + (activity.cost || 0)
      return acc
    }, {} as Record<string, number>)

    setCategories(prev => prev.map(cat => ({
      ...cat,
      spent: categorySpending[cat.id] || 0
    })))
  }, [activities])

  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0)
  const remainingBudget = totalBudget - totalSpent
  const budgetUsedPercentage = (totalSpent / totalBudget) * 100

  const handleBudgetChange = (categoryId: string, newBudget: number) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, budgeted: newBudget } : cat
    ))
  }

  const getBudgetStatus = (spent: number, budgeted: number) => {
    const percentage = (spent / budgeted) * 100
    if (percentage > 100) return { status: 'over', color: 'text-red-600', bg: 'bg-red-50' }
    if (percentage > 80) return { status: 'warning', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    return { status: 'good', color: 'text-green-600', bg: 'bg-green-50' }
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <DollarSign className="w-6 h-6 mr-2" />
                Budget Tracker
              </h2>
              <p className="text-white/80 mt-1">Track your weekend spending and stay on budget</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 h-[calc(100%-120px)] overflow-y-auto">
          {/* Budget Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-blue-900">Total Budget</h3>
                <Calculator className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">${totalBudget}</div>
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Set total budget"
              />
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-green-900">Total Spent</h3>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600">${totalSpent.toFixed(2)}</div>
              <div className="text-sm text-green-700 mt-2">
                {budgetUsedPercentage.toFixed(1)}% of budget used
              </div>
            </div>

            <div className={`rounded-xl p-6 ${remainingBudget >= 0 ? 'bg-purple-50' : 'bg-red-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-lg font-semibold ${remainingBudget >= 0 ? 'text-purple-900' : 'text-red-900'}`}>
                  Remaining
                </h3>
                {remainingBudget < 0 ? (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <PieChart className="w-5 h-5 text-purple-600" />
                )}
              </div>
              <div className={`text-3xl font-bold ${remainingBudget >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                ${Math.abs(remainingBudget).toFixed(2)}
              </div>
              <div className={`text-sm mt-2 ${remainingBudget >= 0 ? 'text-purple-700' : 'text-red-700'}`}>
                {remainingBudget >= 0 ? 'Available to spend' : 'Over budget'}
              </div>
            </div>
          </div>

          {/* Budget Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Budget Progress</h3>
              <span className="text-sm text-gray-600">{budgetUsedPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  budgetUsedPercentage > 100 ? 'bg-red-500' : 
                  budgetUsedPercentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
            <div className="space-y-4">
              {categories.map((category) => {
                const status = getBudgetStatus(category.spent, category.budgeted)
                const percentage = category.budgeted > 0 ? (category.spent / category.budgeted) * 100 : 0
                
                return (
                  <div key={category.id} className={`p-4 rounded-xl border ${status.bg}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${category.color}`} />
                        <h4 className="font-medium text-gray-900">{category.name}</h4>
                      </div>
                      <div className={`text-sm font-medium ${status.color}`}>
                        ${category.spent.toFixed(2)} / ${category.budgeted.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              percentage > 100 ? 'bg-red-500' : 
                              percentage > 80 ? 'bg-yellow-500' : category.color
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-gray-600">{percentage.toFixed(0)}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">Budget:</label>
                        <input
                          type="number"
                          value={category.budgeted}
                          onChange={(e) => handleBudgetChange(category.id, Number(e.target.value))}
                          className="w-20 px-2 py-1 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className={`text-sm ${status.color}`}>
                        {category.spent > category.budgeted ? 
                          `$${(category.spent - category.budgeted).toFixed(2)} over` :
                          `$${(category.budgeted - category.spent).toFixed(2)} left`
                        }
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Budget Tips */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div>
                  <h4 className="font-medium text-gray-900">Look for free activities</h4>
                  <p className="text-sm text-gray-600">Many great weekend activities don't cost anything</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div>
                  <h4 className="font-medium text-gray-900">Set category limits</h4>
                  <p className="text-sm text-gray-600">Allocate specific amounts to different activity types</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                <div>
                  <h4 className="font-medium text-gray-900">Track as you go</h4>
                  <p className="text-sm text-gray-600">Update costs in real-time to stay on track</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                <div>
                  <h4 className="font-medium text-gray-900">Plan alternatives</h4>
                  <p className="text-sm text-gray-600">Have backup activities if you're over budget</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default BudgetTracker
