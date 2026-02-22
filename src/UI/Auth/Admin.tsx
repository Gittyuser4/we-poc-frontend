import { useState, useEffect } from 'react';
import { Tabs, Tab, Card, Container, Row, Col, Dropdown, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { analyticsService } from '../../services/analyticsService';
import BarChart from '../../shared/charts/BarChart';
import PieChart from '../../shared/charts/PieChart';
import DonutChart from '../../shared/charts/DonutChart';
import HorizontalBarChart from '../../shared/charts/HorizontalBarChart';
import LineChart from '../../shared/charts/LineChart';
// import StackedAreaChart from '../../shared/charts/StackedAreaChart';
import StackedLineChart from '../../shared/charts/StackedLineChart';
import TangentialPolarBarChart from '../../shared/charts/TangentialPolarBarChart';
import RadialPolarBarChart from '../../shared/charts/RadialPolarBarChart';
import WaterfallChart from '../../shared/charts/WaterfallChart';
// import PolarBarRangeChart from '../../shared/charts/PolarBarRangeChart';
import Invite from './Invite';

const Admin = () => {
  const navigate = useNavigate();
  const [key, setKey] = useState('dashboard');
  const currentUser = authService.getCurrentUser();

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Summary data
  const [summary, setSummary] = useState({
    total_responses: 0,
    mandals_covered: 0,
    divisions_covered: 0,
    villages_covered: 0,
  });

  // Chart data states
  const [timeSeriesData, setTimeSeriesData] = useState<Array<{ name: string; value: number }>>([]);
  const [locationData, setLocationData] = useState<Array<{ name: string; value: number }>>([]);
  const [womenStatusData, setWomenStatusData] = useState<Array<{ name: string; value: number }>>([]);
  const [topInterestsData, setTopInterestsData] = useState<Array<{ name: string; value: number }>>([]);
  // const [mandalData, setMandalData] = useState<Array<{ name: string; value: number }>>([]);
  const [ageGroupData, setAgeGroupData] = useState<Array<{ name: string; value: number }>>([]);
  const [mandalPerformanceData, setMandalPerformanceData] = useState<Array<{ name: string; value: number }>>([]);
  const [monthlyTrendsData, setMonthlyTrendsData] = useState<Array<{ name: string; value: number }>>([]);
  const [govtSchemesData, setGovtSchemesData] = useState<Array<{ name: string; value: number }>>([]);
  const [govtGroupMembershipData, setGovtGroupMembershipData] = useState<Array<{ name: string; value: number }>>([]);
  const [trainingAreasTrends, setTrainingAreasTrends] = useState<{
    categories: string[];
    series: Array<{ name: string; data: number[] }>;
  }>({ categories: [], series: [] });

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch summary
        const summaryData = await analyticsService.getSummary();
        setSummary({
          total_responses: summaryData.total_responses,
          mandals_covered: summaryData.mandals_covered,
          divisions_covered: summaryData.divisions_covered,
          villages_covered: summaryData.villages_covered,
        });

        // Fetch time series data (last 7 days)
        const timeSeries = await analyticsService.getTimeSeries('daily');
        // Take last 7 days of data
        const lastSevenDaysLabels = timeSeries.labels.slice(-7);
        const lastSevenDaysValues = timeSeries.values.slice(-7);
        const formattedTimeSeries = lastSevenDaysLabels.map((label, index) => ({
          name: new Date(label).toLocaleDateString('en-US', { weekday: 'short' }),
          value: lastSevenDaysValues[index] || 0
        }));
        setTimeSeriesData(formattedTimeSeries);

        // Fetch location breakdown (mandals)
        const locationBreakdown = await analyticsService.getLocationBreakdown('mandal');
        const formattedLocation = locationBreakdown.labels.slice(0, 5).map((label, index) => ({
          name: label,
          value: locationBreakdown.values[index]
        }));
        setLocationData(formattedLocation);

        // Fetch women employment status
        const womenStatus = await analyticsService.getWomenStatus();
        const formattedWomenStatus = womenStatus.map(item => ({
          name: item.label,
          value: item.value
        }));
        setWomenStatusData(formattedWomenStatus);

        // Fetch top interests
        const topInterests = await analyticsService.getTopInterests();
        const formattedTopInterests = topInterests.map(item => ({
          name: item.label,
          value: item.value
        }));
        setTopInterestsData(formattedTopInterests);

        // Fetch mandal breakdown (top 10 mandals)
        // const mandalBreakdown = await analyticsService.getLocationBreakdown('mandal');
        // const formattedMandal = mandalBreakdown.labels.slice(0, 10).map((label, index) => ({
        //   name: label,
        //   value: mandalBreakdown.values[index]
        // }));
        // setMandalData(formattedMandal);

        // Fetch mandal performance (from dedicated endpoint for polar chart)
        try {
          const mandalPerf = await analyticsService.getMandalPerformance();
          const formattedMandalPerf = mandalPerf.labels.map((label, index) => ({
            name: label,
            value: mandalPerf.values[index]
          }));
          setMandalPerformanceData(formattedMandalPerf);
        } catch (err) {
          console.warn('Could not fetch mandal performance data:', err);
        }

        // Fetch age group analytics
        try {
          const ageGroupAnalytics = await analyticsService.getAgeGroupAnalytics();
          const formattedAgeGroup = ageGroupAnalytics.labels.map((label, index) => ({
            name: label,
            value: ageGroupAnalytics.values[index]
          }));
          setAgeGroupData(formattedAgeGroup);
        } catch (err) {
          console.warn('Could not fetch age group data:', err);
        }

        // Fetch monthly registration trends
        try {
          const monthlyTrends = await analyticsService.getMonthlyRegistrationTrends();
          const formattedMonthlyTrends = monthlyTrends.labels.map((label, index) => ({
            name: label,
            value: monthlyTrends.values[index]
          }));
          setMonthlyTrendsData(formattedMonthlyTrends);
        } catch (err) {
          console.warn('Could not fetch monthly registration trends:', err);
        }

        // Fetch government schemes analytics
        try {
          const govtSchemes = await analyticsService.getGovtSchemesAnalytics();
          const formattedGovtSchemes = govtSchemes.labels.map((label, index) => ({
            name: label,
            value: govtSchemes.values[index]
          }));
          setGovtSchemesData(formattedGovtSchemes);
        } catch (err) {
          console.warn('Could not fetch government schemes data:', err);
        }

        // Fetch government group membership analytics
        try {
          const govtGroups = await analyticsService.getGovtGroupMembershipAnalytics();
          const formattedGovtGroups = govtGroups.labels.map((label, index) => ({
            name: label,
            value: govtGroups.values[index]
          }));
          setGovtGroupMembershipData(formattedGovtGroups);
        } catch (err) {
          console.warn('Could not fetch government group membership data:', err);
        }

        // Fetch training areas trends
        const trainingTrends = await analyticsService.getTrainingAreasTrends();
        setTrainingAreasTrends(trainingTrends);

      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (key === 'dashboard') {
      fetchDashboardData();
    }
  }, [key]);
  
  // Mock data for charts not yet connected (keeping for now)
  // const womenEmploymentData = [
  //   { name: 'Employed', value: 4500 },
  //   { name: 'Unemployed', value: 2300 },
  //   { name: 'Self-Employed', value: 1800 },
  //   { name: 'Students', value: 2100 },
  //   { name: 'Homemakers', value: 3200 }
  // ];

  // Stacked area chart data
  // const stackedAreaData = [
  //   {
  //     name: 'Email',
  //     data: [120, 132, 101, 134, 90, 230, 210]
  //   },
  //   {
  //     name: 'Union Ads',
  //     data: [220, 182, 191, 234, 290, 330, 310]
  //   },
  //   {
  //     name: 'Video Ads',
  //     data: [150, 232, 201, 154, 190, 330, 410]
  //   },
  //   {
  //     name: 'Direct',
  //     data: [320, 332, 301, 334, 390, 330, 320]
  //   },
  //   {
  //     name: 'Search Engine',
  //     data: [820, 932, 901, 934, 1290, 1330, 1320]
  //   }
  // ];

  // const stackedCategories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Stacked line chart data (same as area chart for demo)
  // const stackedLineData = stackedAreaData;

  // Tangential polar bar chart data (UNUSED - kept for reference only)
  // const polarBarData = [2, 1.2, 2.4, 3.6];
  // const polarCategories = ['a', 'b', 'c', 'd'];

  return (
    <div className="p-4">
      {/* Header with User Info and Logout */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white shadow-sm rounded">
        <div>
          <h4 className="mb-0">Admin Dashboard</h4>
          {currentUser && (
            <small className="text-muted">
              Welcome, {currentUser.full_name || currentUser.email}
            </small>
          )}
        </div>
        <Dropdown align="end">
          <Dropdown.Toggle variant="outline-primary" id="user-dropdown">
            <i className="bi bi-person-circle me-2"></i>
            {currentUser?.email}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item disabled>
              <strong>{currentUser?.full_name || 'Admin'}</strong>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <Tabs
        id="admin-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k || 'dashboard')}
        className="mb-4"
        style={{ 
          borderBottom: '2px solid #4d86dc'
        }}
      >
        <Tab 
          eventKey="dashboard" 
          title="Dashboard"
          tabClassName="text-primary"
        >
          <Container fluid>
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError(null)}>
                <Alert.Heading>Error Loading Dashboard</Alert.Heading>
                <p>{error}</p>
              </Alert>
            )}

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status" variant="primary" style={{ width: '3rem', height: '3rem' }}>
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-3 text-muted">Loading dashboard data...</p>
              </div>
            ) : (
              <>
            {/* Summary Cards Row */}
            <Row className="g-4 mb-4">
              <Col xs={12} md={3}>
                <Card className="h-100 shadow text-center">
                  <Card.Body>
                    <h6 className="text-muted mb-2">Total Responses</h6>
                    <h2 className="mb-0 text-primary">{summary.total_responses.toLocaleString()}</h2>
                    <small className="text-muted">Survey submissions</small>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} md={3}>
                <Card className="h-100 shadow text-center">
                  <Card.Body>
                    <h6 className="text-muted mb-2">Mandals Covered</h6>
                    <h2 className="mb-0 text-primary">{summary.mandals_covered}</h2>
                    <small className="text-muted">Active mandals</small>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} md={3}>
                <Card className="h-100 shadow text-center">
                  <Card.Body>
                    <h6 className="text-muted mb-2">Revenue Divisions</h6>
                    <h2 className="mb-0 text-primary">{summary.divisions_covered}</h2>
                    <small className="text-muted">Active divisions</small>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} md={3}>
                <Card className="h-100 shadow text-center">
                  <Card.Body>
                    <h6 className="text-muted mb-2">Villages Covered</h6>
                    <h2 className="mb-0 text-primary">{summary.villages_covered}</h2>
                    <small className="text-muted">Active villages</small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="g-4">
              
              <Col xs={12} md={6}>
                <Card className="h-100 shadow chart-card">
                  <Card.Body style={{ paddingBottom: '3rem', minHeight: '420px' }}>
                    <h5 className="mb-3 text-muted">Women Employment Status - District</h5>
                    {womenStatusData.length > 0 ? (
                      <DonutChart data={womenStatusData} colors={['#4d86dc', '#5cb85c', '#f0ad4e', '#d9534f', '#5bc0de']} />
                    ) : (
                      <div className="text-center py-5">
                        <p className="text-muted">No data available yet</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              {/* Bottom Left Card - Mandal Performance Metrics */}
              <Col xs={12} md={6}>
                <Card className="h-100 shadow chart-card">
                  <Card.Body>
                    <h5 className="mb-3 text-muted">Mandal Performance Metrics</h5>
                    {mandalPerformanceData.length > 0 ? (
                      <TangentialPolarBarChart 
                        data={mandalPerformanceData.map(d => d.value)}
                        categories={mandalPerformanceData.map(d => d.name)}
                        title="Mandal Performance"
                      />
                    ) : (
                      <div className="text-center py-5">
                        <p className="text-muted">No data available yet</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              {/* Top Right Card - Training Areas Trends */}
              <Col xs={12} md={6}>
                <Card className="h-100 shadow chart-card">
                  <Card.Body>
                    <h5 className="mb-3 text-muted">Training Areas Trends</h5>
                    {trainingAreasTrends.series.length > 0 ? (
                      <StackedLineChart 
                        data={trainingAreasTrends.series} 
                        categories={trainingAreasTrends.categories}
                        title="Training Areas Trends"
                      />
                    ) : (
                      <div className="text-center py-5">
                        <p className="text-muted">No data available yet</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              

              {/* Top Left Card - Top Interests */}
              <Col xs={12} md={6}>
                <Card className="h-100 shadow chart-card">
                  <Card.Body>
                    <h5 className="mb-3 text-muted">Top Interests</h5>
                    {topInterestsData.length > 0 ? (
                      <BarChart data={topInterestsData} color="#17a2b8" />
                    ) : (
                      <div className="text-center py-5">
                        <p className="text-muted">No data available yet</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>

            </Row>

            {/* Government Schemes and Group Membership Charts */}
            <Row className="g-4 mt-2">
              {/* Government Schemes - Radial Polar Bar Chart */}
              <Col xs={12} md={6}>
                <Card className="h-100 shadow chart-card">
                  <Card.Body>
                    <h5 className="mb-3 text-muted">Government Schemes Availed</h5>
                    {govtSchemesData.length > 0 ? (
                      <RadialPolarBarChart 
                        data={govtSchemesData.map(d => d.value)}
                        categories={govtSchemesData.map(d => d.name)}
                        title="Government Schemes"
                        color="#4d86dc"
                      />
                    ) : (
                      <div className="text-center py-5">
                        <p className="text-muted">No data available yet</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              {/* Government Group Membership - Waterfall Chart */}
              <Col xs={12} md={6}>
                <Card className="h-100 shadow chart-card">
                  <Card.Body>
                    <h5 className="mb-3 text-muted">Government Group Membership</h5>
                    {govtGroupMembershipData.length > 0 ? (
                      <WaterfallChart 
                        data={govtGroupMembershipData} 
                        title="Government Group Membership"
                        color="#5cb85c" 
                      />
                    ) : (
                      <div className="text-center py-5">
                        <p className="text-muted">No data available yet</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            {/* Daily Trends and Other Charts - Two Column Layout */}
            <Row className="g-4 mt-2">
              <Col xs={12} md={6}>
                <Card className="h-100 shadow chart-card">
                  <Card.Body>
                    <h5 className="mb-3 text-muted">Daily Response Trends (Last 7 Days)</h5>
                    {timeSeriesData.length > 0 ? (
                      <BarChart data={timeSeriesData} color="#4d86dc" />
                    ) : (
                      <div className="text-center py-5">
                        <p className="text-muted">No data available yet</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              {/* Age Group Distribution */}
              <Col xs={12} md={6}>
                <Card className="h-100 shadow chart-card">
                  <Card.Body style={{ paddingBottom: '2rem' }}>
                    <h5 className="mb-3 text-muted">Age Group Distribution</h5>
                    {ageGroupData.length > 0 ? (
                      <PieChart data={ageGroupData} colors={['#4d86dc', '#5cb85c', '#f0ad4e', '#d9534f', '#5bc0de', '#17a2b8']} />
                    ) : (
                      <div className="text-center py-5">
                        <p className="text-muted">No data available yet</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              {/* Top Mandals */}
              <Col xs={12} md={6}>
                <Card className="h-100 shadow chart-card">
                  <Card.Body>
                    <h5 className="mb-3 text-muted">Top mandals</h5>
                    {locationData.length > 0 ? (
                      <HorizontalBarChart data={locationData} color="#5cb85c" />
                    ) : (
                      <div className="text-center py-5">
                        <p className="text-muted">No data available yet</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              {/* Monthly Registration Trends */}
              <Col xs={12} md={6}>
                <Card className="h-100 shadow chart-card">
                  <Card.Body>
                    <h5 className="mb-3 text-muted">Monthly Registration Trends</h5>
                    {monthlyTrendsData.length > 0 ? (
                      <LineChart data={monthlyTrendsData} color="#f0ad4e" />
                    ) : (
                      <div className="text-center py-5">
                        <p className="text-muted">No data available yet</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            </>
            )}
            {/* </Card> */}
          </Container>

        </Tab>

        <Tab 
          eventKey="invite" 
          title="Invite"
          tabClassName="text-primary"
        >
          <Invite/>
        </Tab>
      </Tabs>
    </div>
  );
}

export default Admin;