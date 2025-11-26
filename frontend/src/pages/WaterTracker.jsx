import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Form, Modal, Alert, Spinner, ProgressBar, ListGroup, Table, Badge } from 'react-bootstrap'
import { waterService } from '../services/waterService'
import { useAuth } from '../context/AuthContext'
import LocalDrinkIcon from '@mui/icons-material/LocalDrink'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import OpacityIcon from '@mui/icons-material/Opacity'
import TodayIcon from '@mui/icons-material/Today'

const WaterTracker = () => {
  const { user } = useAuth()
  const [waterIntakes, setWaterIntakes] = useState([])
  const [todayIntake, setTodayIntake] = useState({ intakes: [], total_today: 0, goal: 2000, progress_percentage: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showIntakeModal, setShowIntakeModal] = useState(false)

  const [intakeForm, setIntakeForm] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: 250
  })

  const presetAmounts = [250, 500, 750, 1000]

  useEffect(() => {
    loadWaterData()
  }, [])

  const loadWaterData = async () => {
    try {
      const [intakesData, todayData] = await Promise.all([
        waterService.getWaterIntakes(),
        waterService.getTodayIntake()
      ])
      setWaterIntakes(intakesData)
      setTodayIntake(todayData)
    } catch (error) {
      setError('Failed to load water data')
      console.error('Water error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateIntake = async (amount = null) => {
    try {
      const intakeData = {
        ...intakeForm,
        amount: amount || intakeForm.amount
      }
      await waterService.createWaterIntake(intakeData)
      setShowIntakeModal(false)
      setIntakeForm({
        date: new Date().toISOString().split('T')[0],
        amount: 250
      })
      loadWaterData()
    } catch (error) {
      setError('Failed to log water intake')
    }
  }

  const handleDeleteIntake = async (id) => {
    if (window.confirm('Are you sure you want to delete this water intake?')) {
      try {
        await waterService.deleteWaterIntake(id)
        loadWaterData()
      } catch (error) {
        setError('Failed to delete water intake')
      }
    }
  }

  const getHydrationStatus = (percentage) => {
    if (percentage >= 100) return { status: 'Excellent!', variant: 'success', emoji: '🎉' }
    if (percentage >= 75) return { status: 'Good Job!', variant: 'info', emoji: '👍' }
    if (percentage >= 50) return { status: 'Halfway There', variant: 'warning', emoji: '💪' }
    if (percentage >= 25) return { status: 'Keep Going', variant: 'warning', emoji: '🚰' }
    return { status: 'Get Started', variant: 'danger', emoji: '💧' }
  }

  const hydrationStatus = getHydrationStatus(todayIntake.progress_percentage)

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
                <LocalDrinkIcon className="me-2" />
                Water Tracker
              </h1>
              <p className="text-muted mb-0">Stay hydrated and track your daily water intake</p>
            </div>
            <Button 
              variant="primary"
              onClick={() => setShowIntakeModal(true)}
            >
              <AddIcon className="me-1" />
              Custom Intake
            </Button>
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Today's Water Progress */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="enhanced-card">
            <Card.Header>
              <h5 className="mb-0">Today's Hydration</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-4">
                <div className="mb-3">
                  <LocalDrinkIcon style={{ fontSize: '4rem' }} className="text-primary" />
                </div>
                <h2 className="text-primary mb-2">
                  {todayIntake.total_today}ml / {todayIntake.goal}ml
                </h2>
                <div className={`badge bg-${hydrationStatus.variant} fs-6 mb-3`}>
                  {hydrationStatus.emoji} {hydrationStatus.status}
                </div>
                <ProgressBar 
                  variant={hydrationStatus.variant}
                  now={todayIntake.progress_percentage}
                  style={{ height: '20px' }}
                  className="mb-3"
                />
                <div className="d-flex justify-content-between text-muted">
                  <small>0%</small>
                  <small>{todayIntake.progress_percentage}%</small>
                  <small>100%</small>
                </div>
              </div>

              {/* Quick Add Buttons */}
              <div className="mb-4">
                <h6 className="text-center mb-3">Quick Add</h6>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  {presetAmounts.map(amount => (
                    <Button
                      key={amount}
                      variant="outline-primary"
                      className="d-flex flex-column align-items-center"
                      style={{ width: '80px', height: '80px' }}
                      onClick={() => handleCreateIntake(amount)}
                    >
                      <OpacityIcon className="mb-1" />
                      <span>{amount}ml</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Today's Intake History */}
              {todayIntake.intakes.length > 0 && (
                <div>
                  <h6 className="mb-3">Today's Intakes</h6>
                  <ListGroup variant="flush">
                    {todayIntake.intakes.map(intake => (
                      <ListGroup.Item key={intake.id} className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className="fw-bold">{intake.amount}ml</span>
                          <small className="text-muted ms-2">
                            at {new Date(`2000-01-01T${intake.consumed_at}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </small>
                        </div>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteIntake(intake.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Hydration Tips & Stats */}
        <Col lg={4}>
          <Card className="enhanced-card mb-4">
            <Card.Header>
              <h6 className="mb-0">Hydration Tips</h6>
            </Card.Header>
            <Card.Body>
              <div className="space-y-2">
                <div className="d-flex align-items-start">
                  <div className="bg-primary bg-opacity-10 rounded p-1 me-2">
                    <OpacityIcon fontSize="small" className="text-primary" />
                  </div>
                  <small>Drink 1-2 glasses of water after waking up</small>
                </div>
                <div className="d-flex align-items-start">
                  <div className="bg-success bg-opacity-10 rounded p-1 me-2">
                    <LocalDrinkIcon fontSize="small" className="text-success" />
                  </div>
                  <small>Keep a water bottle with you throughout the day</small>
                </div>
                <div className="d-flex align-items-start">
                  <div className="bg-info bg-opacity-10 rounded p-1 me-2">
                    <TodayIcon fontSize="small" className="text-info" />
                  </div>
                  <small>Set reminders to drink water every hour</small>
                </div>
                <div className="d-flex align-items-start">
                  <div className="bg-warning bg-opacity-10 rounded p-1 me-2">
                    <LocalDrinkIcon fontSize="small" className="text-warning" />
                  </div>
                  <small>Drink water before, during, and after exercise</small>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Weekly Summary */}
          <Card className="enhanced-card">
            <Card.Header>
              <h6 className="mb-0">This Week</h6>
            </Card.Header>
            <Card.Body>
              <div className="text-center">
                <div className="mb-3">
                  <LocalDrinkIcon className="text-info" style={{ fontSize: '2rem' }} />
                </div>
                <h4 className="text-info">{todayIntake.total_today}ml</h4>
                <p className="text-muted mb-0">Today's Intake</p>
              </div>
              <div className="mt-3 p-3 bg-light rounded">
                <small className="text-muted">
                  Daily Goal: <strong>{todayIntake.goal}ml</strong>
                </small>
                <br />
                <small className="text-muted">
                  Remaining: <strong>{Math.max(0, todayIntake.goal - todayIntake.total_today)}ml</strong>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Water History */}
      <Row>
        <Col>
          <Card className="enhanced-card">
            <Card.Header>
              <h5 className="mb-0">Recent Water Intake History</h5>
            </Card.Header>
            <Card.Body>
              {waterIntakes.length > 0 ? (
                <div className="table-responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Time</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {waterIntakes.slice(0, 10).map(intake => (
                        <tr key={intake.id}>
                          <td>{new Date(intake.date).toLocaleDateString()}</td>
                          <td>
                            <Badge bg="primary">
                              <LocalDrinkIcon fontSize="small" className="me-1" />
                              {intake.amount}ml
                            </Badge>
                          </td>
                          <td>
                            {new Date(`2000-01-01T${intake.consumed_at}`).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteIntake(intake.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <LocalDrinkIcon style={{ fontSize: '4rem' }} className="text-muted mb-3" />
                  <h5>No Water Intake History</h5>
                  <p className="text-muted">Start tracking your water intake to see your hydration history</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Custom Intake Modal */}
      <Modal show={showIntakeModal} onHide={() => setShowIntakeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Log Water Intake</Modal.Title>
        </Modal.Header>
        <Form onSubmit={(e) => { e.preventDefault(); handleCreateIntake(); }}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={intakeForm.date}
                onChange={(e) => setIntakeForm({...intakeForm, date: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount (ml)</Form.Label>
              <Form.Control
                type="number"
                value={intakeForm.amount}
                onChange={(e) => setIntakeForm({...intakeForm, amount: parseInt(e.target.value)})}
                min="1"
                required
              />
            </Form.Group>
            <div className="mb-3">
              <Form.Label>Quick Select</Form.Label>
              <div className="d-flex gap-2">
                {presetAmounts.map(amount => (
                  <Button
                    key={amount}
                    variant="outline-secondary"
                    type="button"
                    onClick={() => setIntakeForm({...intakeForm, amount})}
                  >
                    {amount}ml
                  </Button>
                ))}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowIntakeModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Log Intake
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default WaterTracker