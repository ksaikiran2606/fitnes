import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Form, Modal, Table, Badge, Alert, Spinner, ProgressBar } from 'react-bootstrap'
import { dietService } from '../services/dietService'
import { useAuth } from '../context/AuthContext'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import EggIcon from '@mui/icons-material/Egg'
import BakeryDiningIcon from '@mui/icons-material/BakeryDining'
import SetMealIcon from '@mui/icons-material/SetMeal'

const Diet = () => {
  const { user } = useAuth()
  const [meals, setMeals] = useState([])
  const [todayMeals, setTodayMeals] = useState([])
  const [nutrition, setNutrition] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showMealModal, setShowMealModal] = useState(false)

  const [mealForm, setMealForm] = useState({
    name: '',
    meal_type: 'BREAKFAST',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    loadDietData()
  }, [])

  const loadDietData = async () => {
    try {
      const [mealsData, todayMealsData, nutritionData] = await Promise.all([
        dietService.getMeals(),
        dietService.getTodayMeals(),
        dietService.getDailyNutrition()
      ])
      setMeals(mealsData)
      setTodayMeals(todayMealsData)
      setNutrition(nutritionData)
    } catch (error) {
      setError('Failed to load diet data')
      console.error('Diet error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMeal = async (e) => {
    e.preventDefault()
    try {
      await dietService.createMeal(mealForm)
      setShowMealModal(false)
      setMealForm({
        name: '',
        meal_type: 'BREAKFAST',
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        date: new Date().toISOString().split('T')[0]
      })
      loadDietData()
    } catch (error) {
      setError('Failed to create meal')
    }
  }

  const handleDeleteMeal = async (id) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        await dietService.deleteMeal(id)
        loadDietData()
      } catch (error) {
        setError('Failed to delete meal')
      }
    }
  }

  const getMealTypeIcon = (mealType) => {
    switch (mealType) {
      case 'BREAKFAST': return '🍳'
      case 'LUNCH': return '🍽️'
      case 'DINNER': return '🍲'
      case 'SNACK': return '🍎'
      default: return '🍴'
    }
  }

  const getMealTypeVariant = (mealType) => {
    switch (mealType) {
      case 'BREAKFAST': return 'warning'
      case 'LUNCH': return 'info'
      case 'DINNER': return 'primary'
      case 'SNACK': return 'success'
      default: return 'secondary'
    }
  }

  const calculateTodayTotals = () => {
    return todayMeals.reduce((totals, meal) => ({
      calories: totals.calories + meal.calories,
      protein: totals.protein + parseFloat(meal.protein),
      carbs: totals.carbs + parseFloat(meal.carbs),
      fats: totals.fats + parseFloat(meal.fats)
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 })
  }

  const todayTotals = calculateTodayTotals()
  const calorieGoal = user?.daily_calorie_goal || 2000
  const caloriePercentage = Math.min((todayTotals.calories / calorieGoal) * 100, 100)

  if (loading) {
    return (
      <Container className="py-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 mb-1">
                <RestaurantIcon className="me-2" />
                Diet Planner
              </h1>
              <p className="text-muted mb-0">Track your meals and nutrition intake</p>
            </div>
            <Button 
              variant="primary"
              onClick={() => setShowMealModal(true)}
            >
              <AddIcon className="me-1" />
              Add Meal
            </Button>
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Today's Summary */}
      <Row className="mb-4">
        <Col>
          <Card className="enhanced-card">
            <Card.Header>
              <h5 className="mb-0">Today's Nutrition Summary</h5>
            </Card.Header>
            <Card.Body>
              <Row className="text-center">
                <Col md={3} className="mb-3">
                  <div className="stat-number text-primary">
                    {todayTotals.calories}
                  </div>
                  <div className="stat-label">Calories</div>
                  <ProgressBar 
                    variant={caloriePercentage > 100 ? 'danger' : 'success'}
                    now={caloriePercentage}
                    className="mt-2"
                  />
                  <small className="text-muted">
                    {caloriePercentage.toFixed(1)}% of {calorieGoal} goal
                  </small>
                </Col>
                <Col md={3} className="mb-3">
                  <div className="stat-number text-success">
                    {todayTotals.protein.toFixed(1)}g
                  </div>
                  <div className="stat-label">Protein</div>
                  <EggIcon className="text-muted mt-2" />
                </Col>
                <Col md={3} className="mb-3">
                  <div className="stat-number text-warning">
                    {todayTotals.carbs.toFixed(1)}g
                  </div>
                  <div className="stat-label">Carbs</div>
                  <BakeryDiningIcon className="text-muted mt-2" />
                </Col>
                <Col md={3} className="mb-3">
                  <div className="stat-number text-danger">
                    {todayTotals.fats.toFixed(1)}g
                  </div>
                  <div className="stat-label">Fats</div>
                  <SetMealIcon className="text-muted mt-2" />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Today's Meals */}
        <Col lg={8}>
          <Card className="enhanced-card">
            <Card.Header>
              <h5 className="mb-0">Today's Meals</h5>
            </Card.Header>
            <Card.Body>
              {todayMeals.length > 0 ? (
                <div className="space-y-3">
                  {['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'].map(mealType => {
                    const typeMeals = todayMeals.filter(meal => meal.meal_type === mealType)
                    if (typeMeals.length === 0) return null

                    return (
                      <div key={mealType} className="border rounded p-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0">
                            {getMealTypeIcon(mealType)} {mealType}
                          </h6>
                          <Badge bg={getMealTypeVariant(mealType)}>
                            {typeMeals.reduce((sum, meal) => sum + meal.calories, 0)} cal
                          </Badge>
                        </div>
                        {typeMeals.map(meal => (
                          <div key={meal.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                            <div>
                              <strong>{meal.name}</strong>
                              <small className="text-muted d-block">
                                {meal.protein}g protein • {meal.carbs}g carbs • {meal.fats}g fats
                              </small>
                            </div>
                            <div className="d-flex align-items-center">
                              <Badge bg="dark" className="me-2">
                                {meal.calories} cal
                              </Badge>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteMeal(meal.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-4">
                  <RestaurantIcon style={{ fontSize: '4rem' }} className="text-muted mb-3" />
                  <h5>No Meals Today</h5>
                  <p className="text-muted">Start tracking your meals to see your nutrition data</p>
                  <Button variant="primary" onClick={() => setShowMealModal(true)}>
                    <AddIcon className="me-1" />
                    Add Your First Meal
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Add & Nutrition Tips */}
        <Col lg={4}>
          <Card className="enhanced-card mb-4">
            <Card.Header>
              <h6 className="mb-0">Quick Add Meal</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                {['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'].map(mealType => (
                  <Button
                    key={mealType}
                    variant="outline-primary"
                    onClick={() => {
                      setMealForm({...mealForm, meal_type: mealType})
                      setShowMealModal(true)
                    }}
                  >
                    {getMealTypeIcon(mealType)} Add {mealType}
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Nutrition Tips */}
          <Card className="enhanced-card">
            <Card.Header>
              <h6 className="mb-0">Nutrition Tips</h6>
            </Card.Header>
            <Card.Body>
              <div className="space-y-2">
                <div className="d-flex">
                  <EggIcon className="text-success me-2" fontSize="small" />
                  <small>Aim for 1.6-2.2g of protein per kg of body weight</small>
                </div>
                <div className="d-flex">
                  <BakeryDiningIcon className="text-warning me-2" fontSize="small" />
                  <small>Choose complex carbs over simple sugars</small>
                </div>
                <div className="d-flex">
                  <SetMealIcon className="text-danger me-2" fontSize="small" />
                  <small>Include healthy fats like avocados and nuts</small>
                </div>
                <div className="d-flex">
                  <LocalFireDepartmentIcon className="text-primary me-2" fontSize="small" />
                  <small>Stay within your daily calorie goal for best results</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Meal Modal */}
      <Modal show={showMealModal} onHide={() => setShowMealModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Meal</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateMeal}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Meal Name</Form.Label>
              <Form.Control
                type="text"
                value={mealForm.name}
                onChange={(e) => setMealForm({...mealForm, name: e.target.value})}
                required
                placeholder="e.g., Oatmeal with fruits, Grilled chicken salad"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Meal Type</Form.Label>
                  <Form.Select
                    value={mealForm.meal_type}
                    onChange={(e) => setMealForm({...mealForm, meal_type: e.target.value})}
                  >
                    <option value="BREAKFAST">Breakfast</option>
                    <option value="LUNCH">Lunch</option>
                    <option value="DINNER">Dinner</option>
                    <option value="SNACK">Snack</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={mealForm.date}
                    onChange={(e) => setMealForm({...mealForm, date: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Calories</Form.Label>
              <Form.Control
                type="number"
                value={mealForm.calories}
                onChange={(e) => setMealForm({...mealForm, calories: parseInt(e.target.value)})}
                min="0"
                required
              />
            </Form.Group>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Protein (g)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    value={mealForm.protein}
                    onChange={(e) => setMealForm({...mealForm, protein: parseFloat(e.target.value)})}
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Carbs (g)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    value={mealForm.carbs}
                    onChange={(e) => setMealForm({...mealForm, carbs: parseFloat(e.target.value)})}
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Fats (g)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    value={mealForm.fats}
                    onChange={(e) => setMealForm({...mealForm, fats: parseFloat(e.target.value)})}
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowMealModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Meal
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default Diet