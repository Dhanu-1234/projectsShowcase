import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectItem from '../ProjectItem'
import './index.css'

const resultStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

class ProjectsShowcase extends Component {
  state = {
    category: categoriesList[0].id,
    projectsList: [],
    resultStatus: resultStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    this.setState({resultStatus: resultStatusConstants.loading})
    const {category} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${category}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const {projects} = data
      const updatedData = projects.map(eachObj => ({
        id: eachObj.id,
        name: eachObj.name,
        imageUrl: eachObj.image_url,
      }))

      this.setState({
        projectsList: updatedData,
        resultStatus: resultStatusConstants.success,
      })
    } else {
      this.setState({resultStatus: resultStatusConstants.failure})
    }
  }

  onCategoryChange = event => {
    this.setState({category: event.target.value}, this.getProjects)
  }

  onRetry = () => {
    this.getProjects()
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#328af2" height={50} width={50} />
    </div>
  )

  renderSuccessView = () => {
    const {projectsList} = this.state

    return (
      <ul className="projects-list">
        {projectsList.map(eachObj => (
          <ProjectItem key={eachObj.id} projectDetails={eachObj} />
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="failure-bg-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-btn" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  getResults = () => {
    const {resultStatus} = this.state
    let result
    switch (resultStatus) {
      case resultStatusConstants.loading:
        result = this.renderLoadingView()
        break
      case resultStatusConstants.success:
        result = this.renderSuccessView()
        break
      case resultStatusConstants.failure:
        result = this.renderFailureView()
        break
      default:
        result = null
        break
    }
    return result
  }

  render() {
    const {category} = this.state
    return (
      <div className="app-container">
        <div className="header">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo-styles"
          />
        </div>
        <div className="content-container">
          <select
            value={category}
            className="dropdown-styles"
            onChange={this.onCategoryChange}
          >
            {categoriesList.map(eachObj => (
              <option key={eachObj.id} value={eachObj.id}>
                {eachObj.displayText}
              </option>
            ))}
          </select>
          {this.getResults()}
        </div>
      </div>
    )
  }
}

export default ProjectsShowcase
