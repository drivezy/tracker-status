import React, { Component } from 'react';

import moment from 'moment';

import './index.css';

const endPoint = 'https://analytics.justride.in/svt/devices/';
// const url = 'https://analytics.justride.in/svt/devices/170800056?key=4655oWxflzaETX'
const key = '?key=4655oWxflzaETX'

const headers = {
    'Content-Type': 'application/json;charset=UTF-8'
};


class ShowMessage extends Component {
    render() {
        const { message, type = 'success' } = this.props;
        const path = type == 'success' ? require('./../img/correct.png') : require('./../img/error.png');
        return (
            <div className='result message animated' id={`display-${type}`}>
                <img src={path} alt="Success" />
                {message.map((msg, key) => (
                    <p className='min-width-75' key={key}> {msg} </p>
                ))}
            </div>
        )
    }
}

export default class TrackerCheck extends Component {
    constructor(props) {
        super(props);

        this.state = {
            trackerVal: '',
            message: '',
            messageType: 'success'
        }
    }

    validate = async () => {
        const { trackerVal } = this.state;
        const url = endPoint + trackerVal + key;
        this.setState({ showMessage: false });
        fetch(url, { headers, method: 'GET', credentials: 'include' }).then((response) => response.json())
            .then((response) => {
                this.resolve(response);
            })
            .catch((error) => {
                console.error(error);
                alert('Error', error);
            });
    }

    resolve = (res) => {
        console.log(res);
        let message, messageType;


        if (res.error) {
            messageType = 'error';
            message = [res.error];
            const submit = document.getElementById('submit');
            submit.classList.add('shake');
            setTimeout(() => submit.classList.remove('shake'), 800);
        } else {
            let time, device_id, device_type;
            try {
                // [time] = Object.values(res);
                // const reg = /=>.*/g;
                // time = time.match(reg)[0].replace('=> ', '');
                // time = moment(time).fromNow();

                device_type = res.device_type;
                device_id = res.device_id;
                time = res.synced_at;
                time = moment(time).fromNow();
                setTimeout(() => {
                    const message = document.getElementById('display-success');
                    if (message) {
                        message.classList.add('bounceInLeft');
                        setTimeout(() => {
                            message.classList.remove('bounceInLeft');
                        }, 1000);
                    }
                });

            } catch (e) {
                time = e;
            }

            messageType = 'success';
            message = [`Synced ${time}`];
            if (device_id || device_type) {
                message.push(`Device Id -  ${device_id}`);
                message.push(`Device Type -  ${device_type}`);
            }
        }
        this.setState({ message, messageType, showMessage: true });
    }

    render() {
        const { trackerVal, showMessage, message, messageType } = this.state;
        return (
            <div className='main'>
                <h2>
                    Enter Tracker number
                </h2>
                <div className='body-container'>
                    <div className='wrap'>
                        <input className='input-class'
                            placeholder='Enter device number to validate'
                            type='text'
                            value={trackerVal}
                            onChange={e => this.setState({ trackerVal: e.target.value })}
                        />

                        {/* // <button className='submit-button' type='submit' onClick={this.validate.bind(this)}>
                        //     submit
                        // </button> */}

                        <button id='submit' onClick={this.validate.bind(this)} className="button"><span>Submit &#8594;</span></button>
                    </div>
                </div>

                <div className='wrap padding-5'>
                    {
                        showMessage &&
                        <ShowMessage message={message} type={messageType} />
                    }
                </div>
                <div className='footer-text'>
                    Powered by Drivezy
                </div>
            </div>
        )
    }
}