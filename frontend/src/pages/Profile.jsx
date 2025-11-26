import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, ProgressBar, Badge } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import PersonIcon from '@mui/icons-material/Person'
import CalculateIcon from '@mui/icons-material/Calculate'
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight'
import HeightIcon from '@mui/icons-material/Height'
import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'
import TransgenderIcon from '@mui/icons-material/Transgender'
import EmailIcon from '@mui/icons-material/Email'
import CakeIcon from '@mui/icons-material/Cake'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    daily_calorie_goal: 2000,
    daily_water_goal: 2000
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        age: user.age || '',
        weight: user.weight || '',
        height: user.height || '',
        gender: user.gender || '',
        daily_calorie_goal: user.daily_calorie_goal || 2000,
        daily_water_goal: user.daily_water_goal || 2000
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    // Convert string numbers to appropriate types
    const submitData = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      height: formData.height ? parseFloat(formData.height) : null,
      daily_calorie_goal: parseInt(formData.daily_calorie_goal),
      daily_water_goal: parseInt(formData.daily_water_goal)
    }

    const result = await updateProfile(submitData)
    
    if (result.success) {
      setMessage('Profile updated successfully!')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  const calculateBMI = () => {
    if (formData.weight && formData.height) {
      const heightInM = formData.height / 100
      const bmi = (formData.weight / (heightInM * heightInM)).toFixed(1)
      return parseFloat(bmi)
    }
    return null
  }

  const getBMICategory = (bmi) => {
    if (!bmi) return ''
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

  const calculateBMR = () => {
    if (!formData.age || !formData.weight || !formData.height || !formData.gender) {
      return null
    }

    if (formData.gender === 'M') {
      return Math.round(88.362 + (13.397 * formData.weight) + (4.799 * formData.height) - (5.677 * formData.age))
    } else if (formData.gender === 'F') {
      return Math.round(447.593 + (9.247 * formData.weight) + (3.098 * formData.height) - (4.330 * formData.age))
    }
    return null
  }

  const getGenderIcon = (gender) => {
    switch (gender) {
      case 'M': return <MaleIcon className="text-primary" />
      case 'F': return <FemaleIcon className="text-pink" />
      case 'O': return <TransgenderIcon className="text-secondary" />
      default: return <PersonIcon className="text-muted" />
    }
  }

  const bmi = calculateBMI()
  const bmr = calculateBMR()

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center">
            <PersonIcon style={{ fontSize: '2.5rem' }} className="text-primary me-3" />
            <div>
              <h1 className="h2 mb-1">Profile Settings</h1>
              <p className="text-muted mb-0">Manage your personal information and fitness goals</p>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Profile Form */}
        <Col lg={8}>
          <Card className="enhanced-card mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <PersonIcon className="me-2" />
                Personal Information
              </h5>
            </Card.Header>
            <Card.Body>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Age</Form.Label>
                      <Form.Control
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="Age"
                        min="1"
                        max="120"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <MonitorWeightIcon className="me-1" fontSize="small" />
                        Weight (kg)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        step="0.1"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="Weight in kg"
                        min="1"
                        max="500"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <HeightIcon className="me-1" fontSize="small" />
                        Height (cm)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        step="0.1"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        placeholder="Height in cm"
                        min="50"
                        max="250"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Gender</Form.Label>
                      <Form.Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Daily Calorie Goal</Form.Label>
                      <Form.Control
                        type="number"
                        name="daily_calorie_goal"
                        value={formData.daily_calorie_goal}
                        onChange={handleChange}
                        placeholder="Daily calorie goal"
                        min="500"
                        max="10000"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Daily Water Goal (ml)</Form.Label>
                  <Form.Control
                    type="number"
                    name="daily_water_goal"
                    value={formData.daily_water_goal}
                    onChange={handleChange}
                    placeholder="Daily water goal in ml"
                    min="500"
                    max="10000"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="w-100 py-2"
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Updating Profile...
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Health Metrics Sidebar */}
        <Col lg={4}>
          {/* BMI Calculator Card */}
          <Card className="enhanced-card mb-4">
            <Card.Header>
              <h6 className="mb-0">
                <CalculateIcon className="me-2" />
                BMI Calculator
              </h6>
            </Card.Header>
            <Card.Body className="text-center">
              {bmi ? (
                <>
                  <div className="mb-3">
                    <h2 className={`text-${getBMIColor(bmi)} display-4 fw-bold`}>
                      {bmi}
                    </h2>
                    <Badge bg={getBMIColor(bmi)} className="fs-6">
                      {getBMICategory(bmi)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">Underweight</small>
                      <small className="text-muted">Normal</small>
                      <small className="text-muted">Overweight</small>
                      <small className="text-muted">Obese</small>
                    </div>
                    <ProgressBar className="mb-2">
                      <ProgressBar variant="warning" now={18.5} key={1} />
                      <ProgressBar variant="success" now={25 - 18.5} key={2} />
                      <ProgressBar variant="warning" now={30 - 25} key={3} />
                      <ProgressBar variant="danger" now={100 - 30} key={4} />
                    </ProgressBar>
                    <small className="text-muted">
                      Based on your current weight and height
                    </small>
                  </div>
                </>
              ) : (
                <div className="py-3">
                  <CalculateIcon style={{ fontSize: '3rem' }} className="text-muted mb-3" />
                  <p className="text-muted mb-0">
                    Enter your weight and height to calculate BMI
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* BMR Calculator Card */}
          <Card className="enhanced-card mb-4">
            <Card.Header>
              <h6 className="mb-0">
                <CakeIcon className="me-2" />
                Basal Metabolic Rate
              </h6>
            </Card.Header>
            <Card.Body className="text-center">
              {bmr ? (
                <>
                  <h3 className="text-primary fw-bold">{bmr}</h3>
                  <p className="text-muted mb-2">calories/day</p>
                  <small className="text-muted">
                    Your body burns {bmr} calories daily at rest
                  </small>
                </>
              ) : (
                <div className="py-2">
                  <CakeIcon className="text-muted mb-2" />
                  <p className="text-muted mb-0 small">
                    Complete your profile to see BMR calculation
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Account Information Card */}
          <Card className="enhanced-card">
            <Card.Header>
              <h6 className="mb-0">Account Information</h6>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                <div className="d-flex align-items-center">
                  <PersonIcon className="text-muted me-2" fontSize="small" />
                  <div>
                    <div className="fw-bold">{user?.username}</div>
                    <small className="text-muted">Username</small>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <EmailIcon className="text-muted me-2" fontSize="small" />
                  <div>
                    <div className="fw-bold">{user?.email}</div>
                    <small className="text-muted">Email</small>
                  </div>
                </div>

                {user?.gender && (
                  <div className="d-flex align-items-center">
                    {getGenderIcon(user.gender)}
                    <div className="ms-2">
                      <div className="fw-bold text-capitalize">
                        {user.gender === 'M' ? 'Male' : user.gender === 'F' ? 'Female' : 'Other'}
                      </div>
                      <small className="text-muted">Gender</small>
                    </div>
                  </div>
                )}

                {user?.age && (
                  <div className="d-flex align-items-center">
                    <CakeIcon className="text-muted me-2" fontSize="small" />
                    <div>
                      <div className="fw-bold">{user.age} years</div>
                      <small className="text-muted">Age</small>
                    </div>
                  </div>
                )}

                <div className="mt-3 p-3 bg-light rounded">
                  <small className="text-muted">
                    Member since: {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Daily Goals Summary */}
      <Row>
        <Col>
          <Card className="enhanced-card">
            <Card.Header>
              <h6 className="mb-0">Daily Goals Summary</h6>
            </Card.Header>
            <Card.Body>
              <Row className="text-center">
                <Col md={6} className="mb-3">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <MonitorWeightIcon className="text-primary me-2" />
                    <h5 className="mb-0 text-primary">{formData.daily_calorie_goal}</h5>
                  </div>
                  <p className="text-muted mb-0">Daily Calorie Goal</p>
                  <small className="text-muted">
                    Based on your activity level and goals
                  </small>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <HeightIcon className="text-info me-2" />
                    <h5 className="mb-0 text-info">{formData.daily_water_goal}ml</h5>
                  </div>
                  <p className="text-muted mb-0">Daily Water Goal</p>
                  <small className="text-muted">
                    Recommended for optimal hydration
                  </small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Profile