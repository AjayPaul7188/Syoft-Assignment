import {Component} from 'react'

import {Link} from 'react-router-dom'



import './index.css'

class SignUpPage extends Component {
    state = {
        firstName: '',
        email: '',
        phoneNumber: '',
        password: '',
        lastName: '',
        city: '',
        zipCode: '',
        showError: false,
        errorMsg: '',
        showSuccessMsg: false,
        successMsg: '',
    }

    submitSignUpForm = async event => {
        event.preventDefault()
        const { firstName, lastName, email, password, phoneNumber, city, zipCode } = this.state
        if (firstName==='' || lastName==='' || email==='' || password==='' || phoneNumber==='' || city==='' || zipCode==='') {
            this.setState({
                showError: true,
                errorMsg: 'Please provide all the details required',
            })
        } else {
            const userDetails = { firstName, lastName, email, password, phoneNumber, city, zipCode }
            const url = 'http://localhost:3000/Api/user_registeration/api/user_registeration'

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDetails),
            }


            try {
                const response = await fetch(url, options);
                const data = await response.json();
                console.log(data);
                if (!response.ok) {
                    this.setState({
                        showError: true,
                        errorMsg: data.error,
                    })
                    throw new Error(`HTTP error! status: ${response.status}`);
                } else {
                    this.setState({
                        showSuccessMsg: true,
                        successMsg: data.message,
                    })
                }
            } catch (error) {
                console.log('Error:', error);
            }

            this.setState({
                firstName: '',
                email: '',
                phoneNumber: '',
                password: '',
                lastName: '',
                city: '',
                zipCode: '',
            })
        }
    }

    onChangeFirstname = event => {
        this.setState({firstName: event.target.value})
    }

    onChangeLastname = event => {
        this.setState({lastName: event.target.value})
    }

    onChangeEmail = event => {
        this.setState({email: event.target.value})
    }

    onChangePassword = event => {
        this.setState({password: event.target.value})
    }

    onChangePhoneNumber = event => {
        this.setState({phoneNumber: event.target.value})
    }

    onChangeCity = event => {
        this.setState({city: event.target.value})
    }

    onChangeZipCode = event => {
        this.setState({zipCode: event.target.value})
    }


    render() {
        const { firstName, lastName, email, password, phoneNumber, city, zipCode, showError, errorMsg, successMsg, showSuccessMsg } = this.state

        return (
            <div className='signup-container'>
                <div className='sub-container'>
                    <div className='greeting'>
                        <h1 className='greeting-heading'>Welcome</h1>
                        <h3 className='greeting-para'>We are so glad you  are here!</h3>
                    </div>
                    <div className='form-container'>
                        <h1 className='signup-heading'>Join Us</h1>
                        <p className='insturct'>already have an account <Link to='/login' className='link-item'><p>sign in</p>
                        </Link></p>
                        
                        <form className='signup-form' onSubmit={this.submitSignUpForm}>
                            <div className='signup-input-container'>
                                <label className='input-label' htmlFor='firstname'>First Name</label>
                                <input type='text' id='firstname' className='user-input' placeholder='First Name' value={firstName} onChange={this.onChangeFirstname} />
                            </div>

                            <div className='signup-input-container'>
                                <label className='input-label' htmlFor='lastname'>Last Name</label>
                                <input type='text' id='lastname' className='user-input' placeholder='Last Name' value={lastName} onChange={this.onChangeLastname} />
                            </div>

                            <div className='signup-input-container'>
                                <label className='input-label' htmlFor='email'>Email</label>
                                <input type='text' id='email' className='user-input' placeholder='Email' value={email} onChange={this.onChangeEmail} />
                            </div>

                            <div className='signup-input-container'>
                                <label className='input-label' htmlFor='password'>Password</label>
                                <input type='password' id='password' className='user-input' placeholder='Password' value={password} onChange={this.onChangePassword} />
                            </div>

                            <div className='signup-input-container'>
                                <label className='input-label' htmlFor='phonenumber'>Phone Number</label>
                                <input type='text' id='phonenumber' className='user-input' placeholder='Phone Number' value={phoneNumber} onChange={this.onChangePhoneNumber} />
                            </div>

                            <div className='signup-input-container'>
                                <label className='input-label' htmlFor='city'>City</label>
                                <input type='text' id='city' className='user-input' placeholder='City' value={city} onChange={this.onChangeCity} />
                            </div>

                            <div className='signup-input-container'>
                                <label className='input-label' htmlFor='zipcode'>Zip Code</label>
                                <input type='text' id='zipcode' className='user-input' placeholder='Zip Code' value={zipCode} onChange={this.onChangeZipCode} />
                            </div>

                            <button className='submit-btn' type='submit'>Sign Up</button>

                        </form>
                        {showSuccessMsg && <p className="success-msg">{successMsg}</p>}
                        {showError && <p className="error-msg">*{errorMsg}</p>}
                    </div>
                </div>
            </div>
        )
    }

}

export default SignUpPage