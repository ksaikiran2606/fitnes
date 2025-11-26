import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, ProgressBar, Spinner, Alert, Button, Badge } from 'react-bootstrap'
import { dashboardService } from '../services/dashboardService'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import SimpleChart from '../components/SimpleChart'
import ProgressCircle from '../components/ProgressCircle'

// Icons
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import LocalDrinkIcon from '@mui/icons-material/LocalDrink'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import CalculateIcon from '@mui/icons-material/Calculate'
import AddIcon from '@mui/icons-material/Add'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight'
import HeightIcon from '@mui/icons-material/Height'
import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'
import TransgenderIcon from '@mui/icons-material/Transgender'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import ScheduleIcon from '@mui/icons-material/Schedule'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'

const Dashboard = ({ theme }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState(null)
  const [weeklyData, setWeeklyData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [analyticsData, weeklyChartData] = await Promise.all([
        dashboardService.getDashboardAnalytics(),
        dashboardService.getWeeklyCharts()
      ])
      setAnalytics(analyticsData)
      setWeeklyData(weeklyChartData)
    } catch (error) {
      setError('Failed to load dashboard data')
      console.error('Dashboard error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getBMICategory = (bmi) => {
    if (!bmi) return 'Unknown'
    if (bmi < 18.5) return 'Underweight'
    if (bmi < 25) return 'Normal weight'
    if (bmi < 30) return 'Overweight'
    return 'Obese'
  }

  const getBMIColor = (bmi) => {
    if (!bmi) return 'secondary'
    if (bmi < 18.5) return 'warning'
    if (bmi < 25) return 'success'
    if (bmi < 30) return 'warning'
    return 'danger'
  }

  const getHydrationStatus = (percentage) => {
    if (percentage >= 100) return { status: 'Excellent!', variant: 'success', icon: '💧' }
    if (percentage >= 75) return { status: 'Good Job!', variant: 'info', icon: '👍' }
    if (percentage >= 50) return { status: 'Halfway', variant: 'warning', icon: '💪' }
    if (percentage >= 25) return { status: 'Keep Going', variant: 'warning', icon: '🚰' }
    return { status: 'Get Started', variant: 'danger', icon: '💧' }
  }

  const getCalorieStatus = (percentage) => {
    if (percentage <= 80) return { status: 'Under Target', variant: 'info', icon: '📉' }
    if (percentage <= 100) return { status: 'On Target', variant: 'success', icon: '🎯' }
    return { status: 'Over Target', variant: 'danger', icon: '⚠️' }
  }

  const getAchievements = () => {
    const achievements = []
    
    // Workout achievements
    if (analytics?.workout_analytics?.total_workouts_week >= 5) {
      achievements.push({ 
        name: 'Weekly Warrior', 
        description: 'Completed 5+ workouts this week',
        icon: '🏆',
        color: 'warning'
      })
    }
    
    if (analytics?.workout_analytics?.total_calories_burned_week >= 2000) {
      achievements.push({ 
        name: 'Calorie Crusher', 
        description: 'Burned 2000+ calories this week',
        icon: '🔥',
        color: 'danger'
      })
    }

    // Water achievements
    if (analytics?.water_analytics?.goal_percentage >= 100) {
      achievements.push({ 
        name: 'Hydration Hero', 
        description: 'Met water goal today',
        icon: '💧',
        color: 'info'
      })
    }

    // Diet achievements
    const caloriePercentage = Math.min(
      ((analytics?.diet_analytics?.today_calories || 0) / (analytics?.diet_analytics?.calorie_goal || 2000)) * 100, 
      100
    )
    if (caloriePercentage >= 80 && caloriePercentage <= 100) {
      achievements.push({ 
        name: 'Balanced Diet', 
        description: 'Stayed within calorie target',
        icon: '🥗',
        color: 'success'
      })
    }

    return achievements
  }

  const getWeeklyStreak = () => {
    // Mock data for demonstration - in real app, this would come from backend
    return Math.floor(Math.random() * 7) + 1
  }

  const quickActions = [
    { 
      icon: <AddIcon />, 
      label: 'Log Workout', 
      path: '/workouts', 
      variant: 'primary',
      description: 'Track your exercise'
    },
    { 
      icon: <RestaurantIcon />, 
      label: 'Add Meal', 
      path: '/diet', 
      variant: 'success',
      description: 'Log your nutrition'
    },
    { 
      icon: <LocalDrinkIcon />, 
      label: 'Log Water', 
      path: '/water', 
      variant: 'info',
      description: 'Stay hydrated'
    },
    { 
      icon: <CalculateIcon />, 
      label: 'Update Profile', 
      path: '/profile', 
      variant: 'warning',
      description: 'Set your goals'
    }
  ]

  const hydrationStatus = getHydrationStatus(analytics?.water_analytics?.goal_percentage || 0)
  const calorieStatus = getCalorieStatus(
    Math.min(
      ((analytics?.diet_analytics?.today_calories || 0) / (analytics?.diet_analytics?.calorie_goal || 2000)) * 100, 
      100
    )
  )
  const achievements = getAchievements()
  const weeklyStreak = getWeeklyStreak()

  if (loading) {
    return (
      <Container className="py-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="text-center">
            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
            <div className="mt-3">Loading your fitness dashboard...</div>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-4 fade-in">
      {/* Welcome Header with Streak */}
      <Row className="mb-4">
        <Col>
          <Card className={`enhanced-card border-0 ${theme === 'dark' ? 'bg-dark' : 'gradient-card-primary'}`}>
            <Card.Body className="p-4">
              <Row className="align-items-center">
                <Col md={8}>
                  <h1 className="h2 mb-2 text-white">
                    Welcome back, {user?.first_name || user?.username}! 👋
                  </h1>
                  <p className="mb-0 text-white opacity-90">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </Col>
                <Col md={4} className="text-end">
                  <div className="d-flex align-items-center justify-content-end gap-3">
                    <div className="text-center">
                      <div className="text-white fw-bold fs-4">{weeklyStreak}</div>
                      <small className="text-white opacity-80">Day Streak</small>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-pill px-3 py-2">
                      <span className="text-white fw-bold">
                        {analytics?.user_metrics?.bmi ? `${analytics.user_metrics.bmi} BMI` : 'Update Profile'}
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Stats Overview Cards */}
      <Row className="g-3 mb-4">
        <Col xl={3} lg={6}>
          <Card className={`enhanced-card border-0 h-100 ${theme === 'dark' ? 'bg-gradient-indigo' : 'gradient-card-primary'}`}>
            <Card.Body className="text-white p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <div className="stat-number">
                    {analytics?.workout_analytics?.total_workouts_week || 0}
                  </div>
                  <div className="stat-label opacity-90">Workouts This Week</div>
                </div>
                <div className="bg-white bg-opacity-20 p-2 rounded">
                  <FitnessCenterIcon style={{ fontSize: '2rem' }} />
                </div>
              </div>
              <div className="d-flex align-items-center">
                <LocalFireDepartmentIcon className="me-2" fontSize="small" />
                <span className="opacity-90">
                  {analytics?.workout_analytics?.total_calories_burned_week || 0} calories burned
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6}>
          <Card className={`enhanced-card border-0 h-100 ${theme === 'dark' ? 'bg-gradient-teal' : 'gradient-card-success'}`}>
            <Card.Body className="text-white p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <div className="stat-number">
                    {analytics?.diet_analytics?.today_calories || 0}
                  </div>
                  <div className="stat-label opacity-90">Calories Today</div>
                </div>
                <div className="bg-white bg-opacity-20 p-2 rounded">
                  <RestaurantIcon style={{ fontSize: '2rem' }} />
                </div>
              </div>
              <div>
                <ProgressBar 
                  variant="light"
                  now={Math.min(
                    ((analytics?.diet_analytics?.today_calories || 0) / (analytics?.diet_analytics?.calorie_goal || 2000)) * 100, 
                    100
                  )}
                  className="enhanced-progress mb-2"
                />
                <div className="d-flex justify-content-between align-items-center">
                  <small className="opacity-90">
                    {calorieStatus.icon} {calorieStatus.status}
                  </small>
                  <small className="opacity-90">
                    {Math.round(((analytics?.diet_analytics?.today_calories || 0) / (analytics?.diet_analytics?.calorie_goal || 2000)) * 100)}%
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6}>
          <Card className={`enhanced-card border-0 h-100 ${theme === 'dark' ? 'bg-gradient-cyan' : 'gradient-card-info'}`}>
            <Card.Body className="text-white p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <div className="stat-number">
                    {analytics?.water_analytics?.today_intake || 0}ml
                  </div>
                  <div className="stat-label opacity-90">Water Today</div>
                </div>
                <div className="bg-white bg-opacity-20 p-2 rounded">
                  <LocalDrinkIcon style={{ fontSize: '2rem' }} />
                </div>
              </div>
              <div>
                <ProgressBar 
                  variant="light"
                  now={analytics?.water_analytics?.goal_percentage || 0}
                  className="enhanced-progress mb-2"
                />
                <div className="d-flex justify-content-between align-items-center">
                  <small className="opacity-90">
                    {hydrationStatus.icon} {hydrationStatus.status}
                  </small>
                  <small className="opacity-90">
                    {analytics?.water_analytics?.goal_percentage || 0}%
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6}>
          <Card className={`enhanced-card border-0 h-100 ${theme === 'dark' ? 'bg-gradient-amber' : 'gradient-card-warning'}`}>
            <Card.Body className="text-white p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <div className="stat-number">
                    {analytics?.user_metrics?.bmi || 'N/A'}
                  </div>
                  <div className="stat-label opacity-90">Body Mass Index</div>
                </div>
                <div className="bg-white bg-opacity-20 p-2 rounded">
                  <MonitorWeightIcon style={{ fontSize: '2rem' }} />
                </div>
              </div>
              <div className="text-center">
                <Badge bg={getBMIColor(analytics?.user_metrics?.bmi)} className="custom-badge fs-6">
                  {getBMICategory(analytics?.user_metrics?.bmi)}
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content Grid */}
      <Row className="g-4">
        {/* Left Column - Progress and Health */}
        <Col lg={8}>
          {/* Progress Tracking */}
          <Row className="g-4 mb-4">
            <Col md={6}>
              <Card className="enhanced-card h-100">
                <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <WhatshotIcon className="me-2 text-danger" />
                    Calorie Balance
                  </h5>
                  <Badge bg={calorieStatus.variant}>
                    {calorieStatus.status}
                  </Badge>
                </Card.Header>
                <Card.Body className="text-center">
                  <ProgressCircle 
                    percentage={Math.min(
                      ((analytics?.diet_analytics?.today_calories || 0) / (analytics?.diet_analytics?.calorie_goal || 2000)) * 100, 
                      100
                    )}
                    size={120}
                    color={
                      (analytics?.diet_analytics?.today_calories / analytics?.diet_analytics?.calorie_goal) > 1 
                        ? '#f5576c' 
                        : '#43e97b'
                    }
                  />
                  <div className="mt-3">
                    <h4 className={
                      analytics?.diet_analytics?.calorie_balance >= 0 ? 'text-success' : 'text-danger'
                    }>
                      {analytics?.diet_analytics?.calorie_balance >= 0 ? '+' : ''}
                      {analytics?.diet_analytics?.calorie_balance || 0}
                    </h4>
                    <p className="text-muted mb-0">Net Calories Today</p>
                    <small className="text-muted">
                      Goal: {analytics?.diet_analytics?.calorie_goal || 2000} calories
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="enhanced-card h-100">
                <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <WaterDropIcon className="me-2 text-info" />
                    Hydration Status
                  </h5>
                  <Badge bg={hydrationStatus.variant}>
                    {hydrationStatus.status}
                  </Badge>
                </Card.Header>
                <Card.Body className="text-center">
                  <ProgressCircle 
                    percentage={analytics?.water_analytics?.goal_percentage || 0}
                    size={120}
                    color="#06b6d4"
                  />
                  <div className="mt-3">
                    <h4 className="text-info">
                      {analytics?.water_analytics?.today_intake || 0}ml
                    </h4>
                    <p className="text-muted mb-0">Water Consumed</p>
                    <small className="text-muted">
                      Goal: {analytics?.water_analytics?.daily_goal || 2000}ml
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Weekly Activity Chart */}
          <Card className="enhanced-card mb-4">
            <Card.Header className="bg-transparent border-0">
              <h5 className="mb-0">
                <ScheduleIcon className="me-2" />
                Weekly Activity Overview
              </h5>
            </Card.Header>
            <Card.Body>
              <SimpleChart
                title="Workouts This Week"
                data={[
                  { label: 'Mon', value: 3 },
                  { label: 'Tue', value: 2 },
                  { label: 'Wed', value: 4 },
                  { label: 'Thu', value: 1 },
                  { label: 'Fri', value: 3 },
                  { label: 'Sat', value: 2 },
                  { label: 'Sun', value: 0 }
                ]}
                color={theme === 'dark' ? '#8b5cf6' : '#667eea'}
                height={200}
              />
            </Card.Body>
          </Card>

          {/* Quick Actions */}
          <Card className="enhanced-card">
            <Card.Header className="bg-transparent border-0">
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                {quickActions.map((action, index) => (
                  <Col xl={3} lg={6} key={index}>
                    <div 
                      className="quick-action-btn h-100"
                      onClick={() => navigate(action.path)}
                    >
                      <div className={`text-${action.variant} mb-2`} style={{ fontSize: '2.5rem' }}>
                        {action.icon}
                      </div>
                      <div className="fw-bold mb-1">{action.label}</div>
                      <small className="text-muted">{action.description}</small>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column - Health Metrics & Achievements */}
        <Col lg={4}>
          {/* Health Metrics */}
          <Card className="enhanced-card mb-4">
            <Card.Header className="bg-transparent border-0">
              <h5 className="mb-0">Health Metrics</h5>
            </Card.Header>
            <Card.Body>
              {analytics?.user_metrics?.bmi ? (
                <div className="space-y-3">
                  <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                    <div className="d-flex align-items-center">
                      <MonitorWeightIcon className="text-primary me-2" />
                      <span>BMI Score</span>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold">{analytics.user_metrics.bmi}</div>
                      <Badge bg={getBMIColor(analytics.user_metrics.bmi)} size="sm">
                        {getBMICategory(analytics.user_metrics.bmi)}
                      </Badge>
                    </div>
                  </div>
                  
                  {analytics.user_metrics.bmr && (
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                      <div className="d-flex align-items-center">
                        <WhatshotIcon className="text-warning me-2" />
                        <span>Basal Metabolic Rate</span>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold">{analytics.user_metrics.bmr}</div>
                        <small className="text-muted">cal/day</small>
                      </div>
                    </div>
                  )}

                  {user?.weight && user?.height && (
                    <>
                      <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                        <div className="d-flex align-items-center">
                          <MonitorWeightIcon className="text-success me-2" />
                          <span>Weight</span>
                        </div>
                        <span className="fw-bold">{user.weight} kg</span>
                      </div>

                      <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                        <div className="d-flex align-items-center">
                          <HeightIcon className="text-info me-2" />
                          <span>Height</span>
                        </div>
                        <span className="fw-bold">{user.height} cm</span>
                      </div>
                    </>
                  )}

                  <Button 
                    variant="outline-primary" 
                    className="w-100"
                    onClick={() => navigate('/profile')}
                  >
                    Update Health Metrics
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <CalculateIcon style={{ fontSize: '3rem' }} className="text-muted mb-3" />
                  <p className="text-muted">Complete your profile to see health metrics</p>
                  <Button variant="primary" onClick={() => navigate('/profile')}>
                    Update Profile
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Achievements */}
          <Card className="enhanced-card">
            <Card.Header className="bg-transparent border-0">
              <h5 className="mb-0">
                <EmojiEventsIcon className="me-2 text-warning" />
                Recent Achievements
              </h5>
            </Card.Header>
            <Card.Body>
              {achievements.length > 0 ? (
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="d-flex align-items-center p-3 bg-light rounded">
                      <div className="fs-3 me-3">{achievement.icon}</div>
                      <div className="flex-grow-1">
                        <div className="fw-bold">{achievement.name}</div>
                        <small className="text-muted">{achievement.description}</small>
                      </div>
                      <Badge bg={achievement.color} className="ms-2">
                        New
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3">
                  <EmojiEventsIcon className="text-muted mb-2" style={{ fontSize: '2.5rem' }} />
                  <p className="text-muted mb-2">No achievements yet</p>
                  <small className="text-muted">
                    Complete workouts, meet goals, and stay consistent to earn achievements!
                  </small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Weekly Summary */}
      <Row className="g-4 mt-4">
        <Col md={6}>
          <Card className="enhanced-card">
            <Card.Header className="bg-transparent border-0">
              <h5 className="mb-0">This Week's Summary</h5>
            </Card.Header>
            <Card.Body>
              <Row className="text-center">
                <Col xs={4} className="border-end">
                  <div className="stat-number text-primary">
                    {analytics?.workout_analytics?.total_workouts_week || 0}
                  </div>
                  <div className="stat-label">Workouts</div>
                </Col>
                <Col xs={4} className="border-end">
                  <div className="stat-number text-success">
                    {analytics?.workout_analytics?.total_calories_burned_week || 0}
                  </div>
                  <div className="stat-label">Calories Burned</div>
                </Col>
                <Col xs={4}>
                  <div className="stat-number text-info">
                    {analytics?.diet_analytics?.weekly_avg_calories 
                      ? Math.round(analytics.diet_analytics.weekly_avg_calories) 
                      : 0
                    }
                  </div>
                  <div className="stat-label">Avg Calories/Day</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="enhanced-card">
            <Card.Header className="bg-transparent border-0">
              <h5 className="mb-0">Daily Goals Progress</h5>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                <div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-bold">Calorie Intake</span>
                    <span>
                      {analytics?.diet_analytics?.today_calories || 0} / {analytics?.diet_analytics?.calorie_goal || 2000}
                    </span>
                  </div>
                  <ProgressBar 
                    variant={
                      (analytics?.diet_analytics?.today_calories / analytics?.diet_analytics?.calorie_goal) > 1 
                        ? 'danger' 
                        : 'success'
                    }
                    now={Math.min(
                      ((analytics?.diet_analytics?.today_calories || 0) / (analytics?.diet_analytics?.calorie_goal || 2000)) * 100, 
                      100
                    )}
                  />
                </div>
                <div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-bold">Water Intake</span>
                    <span>
                      {analytics?.water_analytics?.today_intake || 0}ml / {analytics?.water_analytics?.daily_goal || 2000}ml
                    </span>
                  </div>
                  <ProgressBar 
                    variant="info"
                    now={analytics?.water_analytics?.goal_percentage || 0}
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard