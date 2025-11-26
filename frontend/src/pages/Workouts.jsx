import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Form, Modal, Table, Badge, Alert, Spinner, Tab, Tabs } from 'react-bootstrap'
import { workoutService } from '../services/workoutService'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import TimerIcon from '@mui/icons-material/Timer'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'

const Workouts = () => {
  const [workoutPlans, setWorkoutPlans] = useState([])
  const [exercises, setExercises] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showExerciseModal, setShowExerciseModal] = useState(false)
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  // Form states
  const [planForm, setPlanForm] = useState({
    name: '',
    description: '',
    difficulty: 'B'
  })
  const [exerciseForm, setExerciseForm] = useState({
    name: '',
    sets: 3,
    reps: 10,
    calories_burned: 50,
    rest_time: 60
  })
  const [sessionForm, setSessionForm] = useState({
    workout_plan: '',
    date: new Date().toISOString().split('T')[0],
    duration: 30,
    total_calories_burned: 0,
    notes: ''
  })

  useEffect(() => {
    loadWorkoutData()
  }, [])

  const loadWorkoutData = async () => {
    try {
      console.log('Loading workout data...')
      const [plansData, exercisesData, sessionsData] = await Promise.all([
        workoutService.getWorkoutPlans(),
        workoutService.getExercises(),
        workoutService.getWorkoutSessions()
      ])
      console.log('Workout data loaded:', { plansData, exercisesData, sessionsData })
      setWorkoutPlans(plansData)
      setExercises(exercisesData)
      setSessions(sessionsData)
    } catch (error) {
      console.error('Workout error details:', error)
      setError('Failed to load workout data: ' + (error.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlan = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await workoutService.createWorkoutPlan(planForm)
      setShowPlanModal(false)
      setPlanForm({ name: '', description: '', difficulty: 'B' })
      await loadWorkoutData()
    } catch (error) {
      setError('Failed to create workout plan: ' + (error.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const handleCreateExercise = async (e) => {
    e.preventDefault()
    if (!selectedPlan) return
    
    setLoading(true)
    try {
      await workoutService.addExercise(selectedPlan.id, exerciseForm)
      setShowExerciseModal(false)
      setExerciseForm({ name: '', sets: 3, reps: 10, calories_burned: 50, rest_time: 60 })
      setSelectedPlan(null)
      await loadWorkoutData()
    } catch (error) {
      setError('Failed to create exercise: ' + (error.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSession = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await workoutService.createWorkoutSession(sessionForm)
      setShowSessionModal(false)
      setSessionForm({
        workout_plan: '',
        date: new Date().toISOString().split('T')[0],
        duration: 30,
        total_calories_burned: 0,
        notes: ''
      })
      await loadWorkoutData()
    } catch (error) {
      setError('Failed to create workout session: ' + (error.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePlan = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout plan?')) {
      setLoading(true)
      try {
        await workoutService.deleteWorkoutPlan(id)
        await loadWorkoutData()
      } catch (error) {
        setError('Failed to delete workout plan: ' + (error.message || 'Unknown error'))
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDeleteExercise = async (id) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      setLoading(true)
      try {
        await workoutService.deleteExercise(id)
        await loadWorkoutData()
      } catch (error) {
        setError('Failed to delete exercise: ' + (error.message || 'Unknown error'))
      } finally {
        setLoading(false)
      }
    }
  }

  const getDifficultyBadge = (difficulty) => {
    const variants = {
      'B': 'success',
      'I': 'warning',
      'A': 'danger'
    }
    const labels = {
      'B': 'Beginner',
      'I': 'Intermediate',
      'A': 'Advanced'
    }
    return <Badge bg={variants[difficulty]}>{labels[difficulty]}</Badge>
  }

  const calculateTotalCalories = (planId) => {
    const planExercises = exercises.filter(ex => ex.workout_plan === planId)
    return planExercises.reduce((total, ex) => total + (ex.sets * ex.calories_burned), 0)
  }

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
                <FitnessCenterIcon className="me-2" />
                Workout Plans
              </h1>
              <p className="text-muted mb-0">Manage your workout routines and track your progress</p>
            </div>
            <div>
              <Button 
                variant="primary" 
                className="me-2"
                onClick={() => setShowPlanModal(true)}
                disabled={loading}
              >
                <AddIcon className="me-1" />
                New Plan
              </Button>
              <Button 
                variant="success"
                onClick={() => setShowSessionModal(true)}
                disabled={loading}
              >
                <PlayArrowIcon className="me-1" />
                Log Session
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}

      <Tabs defaultActiveKey="plans" className="mb-4">
        {/* Workout Plans Tab */}
        <Tab eventKey="plans" title="Workout Plans">
          <Row className="g-4">
            {workoutPlans.map(plan => (
              <Col lg={6} key={plan.id}>
                <Card className="enhanced-card h-100">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{plan.name}</h5>
                    {getDifficultyBadge(plan.difficulty)}
                  </Card.Header>
                  <Card.Body>
                    <p className="text-muted">{plan.description}</p>
                    
                    <div className="mb-3">
                      <h6>Exercises ({plan.exercises ? plan.exercises.length : 0})</h6>
                      {exercises.filter(ex => ex.workout_plan === plan.id).map(exercise => (
                        <div key={exercise.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                          <div>
                            <strong>{exercise.name}</strong>
                            <small className="text-muted d-block">
                              {exercise.sets} sets × {exercise.reps} reps
                            </small>
                          </div>
                          <div>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteExercise(exercise.id)}
                              disabled={loading}
                            >
                              <DeleteIcon fontSize="small" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="d-flex justify-content-between text-muted small mb-3">
                      <span>
                        <LocalFireDepartmentIcon fontSize="small" className="me-1" />
                        {calculateTotalCalories(plan.id)} cal total
                      </span>
                      <span>
                        <TimerIcon fontSize="small" className="me-1" />
                        {exercises.filter(ex => ex.workout_plan === plan.id).reduce((total, ex) => total + (ex.sets * ex.rest_time), 0) / 60} min approx
                      </span>
                    </div>

                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          setSelectedPlan(plan)
                          setShowExerciseModal(true)
                        }}
                        disabled={loading}
                      >
                        <AddIcon fontSize="small" className="me-1" />
                        Add Exercise
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeletePlan(plan.id)}
                        disabled={loading}
                      >
                        <DeleteIcon fontSize="small" className="me-1" />
                        Delete Plan
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            
            {workoutPlans.length === 0 && (
              <Col>
                <Card className="text-center enhanced-card">
                  <Card.Body className="py-5">
                    <FitnessCenterIcon style={{ fontSize: '4rem' }} className="text-muted mb-3" />
                    <h4>No Workout Plans Yet</h4>
                    <p className="text-muted mb-3">Create your first workout plan to get started</p>
                    <Button 
                      variant="primary" 
                      onClick={() => setShowPlanModal(true)}
                      disabled={loading}
                    >
                      <AddIcon className="me-1" />
                      Create Workout Plan
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </Tab>

        {/* Workout History Tab */}
        <Tab eventKey="history" title="Workout History">
          <Card className="enhanced-card">
            <Card.Header>
              <h5 className="mb-0">Workout Sessions</h5>
            </Card.Header>
            <Card.Body>
              {sessions.length > 0 ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Workout Plan</th>
                      <th>Duration</th>
                      <th>Calories Burned</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map(session => (
                      <tr key={session.id}>
                        <td>{new Date(session.date).toLocaleDateString()}</td>
                        <td>{session.workout_plan_name || 'Unknown Plan'}</td>
                        <td>{session.duration} min</td>
                        <td>
                          <Badge bg="danger">
                            <LocalFireDepartmentIcon fontSize="small" className="me-1" />
                            {session.total_calories_burned} cal
                          </Badge>
                        </td>
                        <td>{session.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <PlayArrowIcon style={{ fontSize: '4rem' }} className="text-muted mb-3" />
                  <h5>No Workout Sessions Yet</h5>
                  <p className="text-muted">Log your first workout session to track your progress</p>
                  <Button 
                    variant="success" 
                    onClick={() => setShowSessionModal(true)}
                    disabled={loading}
                  >
                    <PlayArrowIcon className="me-1" />
                    Log Workout Session
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Create Workout Plan Modal */}
      <Modal show={showPlanModal} onHide={() => setShowPlanModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Workout Plan</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreatePlan}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Plan Name</Form.Label>
              <Form.Control
                type="text"
                value={planForm.name}
                onChange={(e) => setPlanForm({...planForm, name: e.target.value})}
                required
                placeholder="e.g., Morning Routine, Full Body Workout"
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={planForm.description}
                onChange={(e) => setPlanForm({...planForm, description: e.target.value})}
                placeholder="Describe your workout plan..."
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Difficulty Level</Form.Label>
              <Form.Select
                value={planForm.difficulty}
                onChange={(e) => setPlanForm({...planForm, difficulty: e.target.value})}
                disabled={loading}
              >
                <option value="B">Beginner</option>
                <option value="I">Intermediate</option>
                <option value="A">Advanced</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPlanModal(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Create Plan'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Add Exercise Modal */}
      <Modal show={showExerciseModal} onHide={() => setShowExerciseModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Exercise to {selectedPlan?.name}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateExercise}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Exercise Name</Form.Label>
              <Form.Control
                type="text"
                value={exerciseForm.name}
                onChange={(e) => setExerciseForm({...exerciseForm, name: e.target.value})}
                required
                placeholder="e.g., Push-ups, Squats, Bench Press"
                disabled={loading}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sets</Form.Label>
                  <Form.Control
                    type="number"
                    value={exerciseForm.sets}
                    onChange={(e) => setExerciseForm({...exerciseForm, sets: parseInt(e.target.value)})}
                    min="1"
                    required
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Reps</Form.Label>
                  <Form.Control
                    type="number"
                    value={exerciseForm.reps}
                    onChange={(e) => setExerciseForm({...exerciseForm, reps: parseInt(e.target.value)})}
                    min="1"
                    required
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Calories per Set</Form.Label>
                  <Form.Control
                    type="number"
                    value={exerciseForm.calories_burned}
                    onChange={(e) => setExerciseForm({...exerciseForm, calories_burned: parseInt(e.target.value)})}
                    min="1"
                    required
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rest Time (seconds)</Form.Label>
                  <Form.Control
                    type="number"
                    value={exerciseForm.rest_time}
                    onChange={(e) => setExerciseForm({...exerciseForm, rest_time: parseInt(e.target.value)})}
                    min="0"
                    required
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowExerciseModal(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Add Exercise'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Log Workout Session Modal */}
      <Modal show={showSessionModal} onHide={() => setShowSessionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Log Workout Session</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateSession}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Workout Plan</Form.Label>
              <Form.Select
                value={sessionForm.workout_plan}
                onChange={(e) => setSessionForm({...sessionForm, workout_plan: e.target.value})}
                required
                disabled={loading}
              >
                <option value="">Select a workout plan</option>
                {workoutPlans.map(plan => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={sessionForm.date}
                    onChange={(e) => setSessionForm({...sessionForm, date: e.target.value})}
                    required
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    value={sessionForm.duration}
                    onChange={(e) => setSessionForm({...sessionForm, duration: parseInt(e.target.value)})}
                    min="1"
                    required
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Calories Burned</Form.Label>
              <Form.Control
                type="number"
                value={sessionForm.total_calories_burned}
                onChange={(e) => setSessionForm({...sessionForm, total_calories_burned: parseInt(e.target.value)})}
                min="0"
                required
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={sessionForm.notes}
                onChange={(e) => setSessionForm({...sessionForm, notes: e.target.value})}
                placeholder="How did your workout go?..."
                disabled={loading}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSessionModal(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Log Session'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default Workouts