"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; //ADDED


const Home = () => {
    const [email, setEmail] = useState('');
    const [city, setCity] = useState(''); //ADDED 04052024
    const [headline, setHeadline] = useState('');
    const [loading, setLoading] = useState(false);
    const [purchaseData, setPurchaseData] = useState([]);
    const [totalPurchaseAmount, setTotalPurchaseAmount] = useState(0); // New state variable


    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (city) {

            // Set loading state to true
            setLoading(true);

                     
            //const url = "https://jsonplaceholder.typicode.com/users";
            //const url = "https://drs-api.vercel.app/api/result/" + city;
            const key = "1806759fac1e9f80ffb396986b33870b";
            const url1 = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=" + city + "&appid=" + key;
            const url2 = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=" + city + "&appid=" + key;
            let response = await fetch(url1);  // Make the request to get data from
            let data = await response.json(); // Convert response to JSON format
            console.log(data);
            console.log(data.name);
            setHeadline(data);
            console.log(headline.name);
            console.log(headline.length);
            console.log(headline.weather[0].description);

            let response2 = await fetch(url2);  // Make the request to get data from
            let data2 = await response2.json(); // Convert response to JSON format
            console.log(data2);
            //if success false, set city-id as no records found
            //else if success true and data.data array is not empty,
            //display the city
            //else display "No records found"
            if(data.success === false){
                // Set city text content
                const cityElement = document.getElementById("city-id");
                if (cityElement) {
                    cityElement.innerHTML = "No records found";
                    //add a red background box
                    cityElement.style.backgroundColor = "#EF8490";
                    cityElement.style.padding = "10px";
                    //setPurchaseData(null);
                    setPurchaseData([]);
                    setHeadline([]);
                }
            } else {

                if(data.length > 0){      
                    // Set city text content
                    const cityElement = document.getElementById("city-id");
                    if (cityElement) {
                        cityElement.innerHTML = "Records found, please scroll down to view purchases from: " + city;
                        //add a green background box
                        cityElement.style.backgroundColor = "#90EE90";
                        //with padding
                        cityElement.style.padding = "10px";
                    }  
                }

                if (data.success) {

                    //setPurchaseData(data.data);
                    setHeadline(data);
                    // Sort the array so that items with 'redeemed: false' come first
                    const updatedPurchaseData = data.data.sort((a, b) => {
                        // If 'a.redeemed' is false and 'b.redeemed' is true, put 'a' first.
                        // If 'a.redeemed' is true and 'b.redeemed' is false, put 'b' first.
                        // For other cases, maintain the order.
                        return a.redeemed === b.redeemed ? 0 : a.redeemed ? 1 : -1;
                    });

                    setPurchaseData(updatedPurchaseData);

                    // Calculate total purchase amount with zero decimal places
                    const totalAmount = updatedPurchaseData.reduce((total, purchase) => {
                        return total + parseFloat(purchase.amount_received);
                    }, 0);

                    setTotalPurchaseAmount(totalAmount.toFixed(0)); // Round to zero decimal places
                }

            }


            // Reset loading state and form fields after submission
            setLoading(false);
            // Reset the form fields after submission
            setCity('');
        } else {
          alert('Please enter your city.');
        }
    };
      
      

    return (
        <div>
        {/*Forecast Button */}

            <br />
            <h1 style={styles.form}><b>Weather Application</b></h1>
            <br />

            <br />
            <h3 style={styles.form}>Search for a City below</h3>
            <br />
            

            <form onSubmit={handleSubmit} style={styles.form}>
                {/* city Input Field */}
                <div style={styles.formGroup}>
                    <input 
                        type="search" 
                        id="userCity" 
                        name="userCity" 
                        placeholder="City" 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>

                
                {/* Submit Button */}
                <div style={styles.formGroup}>
                    {/* Show loading spinner or submit button based on loading state */}
                    {loading ? (
                        <input className="" type="submit" value="Searching..." style={styles.buttonPressed} disabled/>
                    ) : (
                        <input className="hover-effect" type="submit" value="Search" style={styles.button} />
                    )}
                </div>
            </form>
            <br />

            {headline && headline.name && (
                <h3 style={styles.form}>{headline.name}</h3>
            )}
            {headline && headline.weather[0].description && (
                <h3 style={styles.form}>{headline.weather[0].description}</h3>
            )}

            <p id="city-id" className="cityReceived" style={styles.form}></p>

            {/* Display purchase data if there is data */}
            {purchaseData.length > 0 && (
                <div style={styles.form}>
                    <br/>
                    <br/>
                    <h2><b><u>Transactions</u></b></h2>
                    {purchaseData.map((purchase, index) => (
                        <div key={index}>

                            {purchase.redeemed ? (
                                //{/*Display with border */}
                                <div style={styles.doneList}>
                                    <div style={styles.listgroup}>
                                        <p><strong>{purchase.product_type}</strong></p>
                                        <p>MYR {purchase.amount_received}</p>
                                    </div>
                                    <div style={styles.listgrouplink}>
                                        <a href={purchase.receipt_url} target="_blank" rel="noopener noreferrer"><u>View Receipt</u></a>
                                        <p>Claimed</p>
                                    </div>
                                </div>
                            ) : (
                                <div key={index} style={styles.recordList}>
                                    <div style={styles.listgroup}>
                                        <p><strong>{purchase.product_type}</strong></p>
                                        <p>MYR {purchase.amount_received}</p>
                                    </div>
                                    <div style={styles.listgrouplink}>
                                        <a href={purchase.receipt_url} target="_blank" rel="noopener noreferrer"><u>View Receipt</u></a>
                                        {/* Use Link to navigate to /instructions and pass purchase.id as a query parameter */}
                                        <Link href={`/instructions?refid=${purchase.id}`} passHref>
                                            <a target="_blank" rel="noopener noreferrer"><u><b>Use Now</b></u></a>
                                        </Link>
                                    </div>
                                </div>
                                //display without border
                            )}

                            
                            {/* Add more fields as needed */}
                        </div>
                    ))}
                </div>
            )}


            <div style={styles.display}>
                    {headline && headline.name && (
                        <p style={styles.cities}>{headline.name}</p>
                    )}
                    <h1>Current Weather</h1>
                    <div style={styles.weather}>
                        <img src="/assets/images/question-sign.png" alt="storm-img" className="weather-icon" />
                        <p style={styles.current}>-</p>
                    </div>
                    
                    <div className="col">
                        <div style={styles.weatherInfo}>
                            <div style={styles.thermometer}>
                                <img src="/assets/images/weather/thermometer.png" alt="thermometer" width="50" height="50" />
                                <p className="temp">-</p>
                            </div> 
                            <div style={styles.windy}>
                                <img src="/assets/images/weather/windy.png" alt="windy" />
                                <p className="wind">-</p>
                            </div>
                        </div>
                        <div style={styles.weatherInfo}>
                            <div style={styles.humidity}>
                                <img src="/assets/images/weather/humidity.png" alt="humidity" />
                                <p className="humid">-</p>
                            </div>
                            <div style={styles.pressure}>
                                <img src="/assets/images/weather/pressure.png" alt="pressure" />
                                <p className="press">-</p>
                            </div>
                        </div>
                    </div>
                </div>
                

                <div style={styles.forecast}>
                    <h1>Forecast</h1>
                    <p className="date-text">Date</p>
                    <div style={styles.gridContainer}>
                        <div style={styles.gridItem}>
                            <p className="time-now">12:00am</p>
                            <p className="time-now-2">3:00am</p>
                            <p className="time-now-3">6.00am</p>
                            <p className="time-now-4">9.00am</p>
                            <p className="time-now-5">12.00pm</p>
                            <p className="time-now-6">3.00pm</p>
                            <p className="time-now-7">6.00pm</p>
                            <p className="time-now-8">9.00pm</p>
                            <p className="time-now-9">12.00am (Next day)</p>
                        </div>

                        <div style={styles.gridItem}>
                            <img src="/assets/images/question-sign.png" alt="weathericon" className="grid-item-icon" />
                        </div>
                        <div style={styles.gridItem}>
                            <img src="/assets/images/question-sign.png" alt="weathericon" className="grid-item-icon-2" />
                        </div>
                        <div style={styles.gridItem}>
                            <img src="/assets/images/question-sign.png" alt="weathericon" className="grid-item-icon-3" />
                        </div>
                        <div style={styles.gridItem}>
                            <img src="/assets/images/question-sign.png" alt="weathericon" className="grid-item-icon-4" />
                        </div>
                        <div style={styles.gridItem}>
                            <img src="/assets/images/question-sign.png" alt="weathericon" className="grid-item-icon-5" />
                        </div>
                        <div style={styles.gridItem}>
                            <img src="/assets/images/question-sign.png" alt="weathericon" className="grid-item-icon-6" />
                        </div>
                        <div style={styles.gridItem}>
                            <img src="/assets/images/question-sign.png" alt="weathericon" className="grid-item-icon-7" />
                        </div>
                        <div style={styles.gridItem}>
                            <img src="/assets/images/question-sign.png" alt="weathericon" className="grid-item-icon-8" />
                        </div>
                        <div style={styles.gridItem}>
                            <img src="/assets/images/question-sign.png" alt="weathericon" className="grid-item-icon-9" />
                        </div>

                        <div style={styles.gridItem}>-</div>
                        <div style={styles.gridItem}>-</div>
                        <div style={styles.gridItem}>-</div>
                        <div style={styles.gridItem}>-</div>
                        <div style={styles.gridItem}>-</div>
                        <div style={styles.gridItem}>-</div>
                        <div style={styles.gridItem}>-</div>
                        <div style={styles.gridItem}>-</div>
                        <div style={styles.gridItem}>-</div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                            <th>12:00am</th>
                            <th>3:00am</th>
                            <th>6:00am</th>
                            <th>9:00am</th>
                            <th>12:00pm</th>
                            <th>3:00pm</th>
                            <th>6:00pm</th>
                            <th>9:00pm</th>
                            <th>12:00am (Next Day)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td className="forecast-icon">
                                <img src="/assets/images/question-sign.png" alt="weathericon" width="40px" />
                            </td>
                            <td className="forecast-icon">
                                <img src="/assets/images/question-sign.png" alt="weathericon" width="40px" />
                            </td>
                            <td className="forecast-icon">
                                <img src="/assets/images/question-sign.png" alt="weathericon" width="40px" />
                            </td>
                            <td className="forecast-icon">
                                <img src="/assets/images/question-sign.png" alt="weathericon" width="40px" />
                            </td>
                            <td className="forecast-icon">
                                <img src="/assets/images/question-sign.png" alt="weathericon" width="40px" />
                            </td>
                            <td className="forecast-icon">
                                <img src="/assets/images/question-sign.png" alt="weathericon" width="40px" />
                            </td>
                            <td className="forecast-icon">
                                <img src="/assets/images/question-sign.png" alt="weathericon" width="40px" />
                            </td>
                            <td className="forecast-icon">
                                <img src="/assets/images/question-sign.png" alt="weathericon" width="40px" />
                            </td>
                            <td className="forecast-icon">
                                <img src="/assets/images/question-sign.png" alt="weathericon" width="40px" />
                            </td>
                            </tr>
                            <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            </tr>
                        </tbody>
                    </table>

                </div>
        </div>
    );
};

// Define styles as an object
const styles = {


    header: {
        backgroundColor: 'aqua',
        color: 'white',
        padding: '50px',
        fontWeight: '800',
        fontSize: '25px',
        textAlign: 'center',
    },
    cloudyImg: {
        width: '40px',
        height: '40px',
        float: 'left',
    },
    sunImg: {
        float: 'right',
        width: '40px',
        height: '40px',
    },
    searchCity: {
        display: 'block',
        alignItems: 'center',
        textAlign: 'center',
    },
    searchId: {
        width: '200px',
        padding: '5px',
        border: 'none',
        borderRadius: '5px',
        position: 'relative',
    },
    searchIcon: {
        background: 'none',
        cursor: 'pointer',
        border: 'none',
    },
    searchIconImg: {
        height: '20px',
        width: '20px',
    },
    location: {
        textAlign: 'center',
        fontSize: '32px',
    },
    display: {
        backgroundImage: 'url(/assets/images/weather/blue-gradient.jpg)',
        margin: '100px auto 0',
        width: '35%',
        borderRadius: '25px',
        padding: '15px 30px 30px 15px',
        textAlign: 'center',
    },
    cities: {
        fontWeight: '500',
        fontSize: '48px',
    },
    current: {
        fontSize: '18px',
        paddingBottom: '15px',
    },
    weather: {
        width: '80px',
        height: '80px',
        textAlign: 'center',
        alignItems: 'center',
    },
    weatherInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
    },
    weatherInfoImg: {
        width: '40px',
        height: '40px',
    },
    thermometer: {
        width: 'calc(50% - 5px)',
        fontSize: '18px',
    },
    windy: {
        width: 'calc(50% - 5px)',
        fontSize: '18px',
    },
    humidity: {
        width: 'calc(50% - 5px)',
        fontSize: '18px',
    },
    pressure: {
        width: 'calc(50% - 5px)',
        fontSize: '18px',
    },
    forecast: {
        textAlign: 'center',
        fontSize: '32px',
        width: '100%',
    },
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: 'auto auto auto auto auto auto auto auto auto',
        padding: '10px',
        margin: '100px',
    },
    gridItem: {
        border: '0.8px solid rgba(0, 0, 0, 0.8)',
        fontSize: '18px',
    },
    table: {
        textAlign: 'center',
        padding: '10px',
        width: '80%',
        display: 'inline',
    },
    td: {
        padding: '20px',
    },
    body: {
        backgroundColor: 'white',
        backgroundImage: 'url(images/11852427_4858794.jpg)',
    },





    form: {
        maxWidth: '400px',
        margin: 'auto',
        textAlign: 'center',
        
    },
    formGroup: {
        marginBottom: '15px',
    },
    headGroup: {
        marginBottom: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        //top padding
        //paddingTop: '10px',
    },
    headText: {
        padding: '5px',
        paddingLeft: '15px',
        paddingRight: '15px',
        borderRadius: '15px',  // Set border-radius to 0 for sharp corners
        border: '1.5px solid black',  // Thick black border
        fontSize: '14px',
        textAlign: 'center',
    },
    headPadding: {
        paddingTop: '10px'
    },
    input: {
        padding: '10px',
        width: '100%',
        borderRadius: '0px',  // Set border-radius to 0 for sharp corners
        border: '2px solid black',  // Thick black border
    },
    checkbox: {
        marginRight: '10px',
    },
    button: {

        padding: '10px 16px',  // Smaller padding for a smaller button
        backgroundColor: 'black',  // Black background color
        color: '#fff',  // White text color
        border: 'none',  // No border
        borderRadius: '0px',  // Set border-radius to 0 for sharp corners
        cursor: 'pointer',
        fontSize: '14px',  // Adjust font size for smaller button text
    }, 
    buttonPressed: {

        padding: '10px 16px',  // Smaller padding for a smaller button
        backgroundColor: 'black',  // Black background color
        color: '#fff',  // White text color
        border: 'none',  // No border
        borderRadius: '0px',  // Set border-radius to 0 for sharp corners
        fontSize: '14px',  // Adjust font size for smaller button text
    }, 
    socialIcon: {
        width: '35px',  // Set the width
        height: '35px', // Set the height
        marginRight: '10px', // Add some spacing if needed
        marginLeft: '10px',
    },   
    socialGroup: {
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center',       // Align items vertically centered
        justifyContent: 'center',   // Align content horizontally centered
        

    },
    recordList: {
        
        borderRadius: '2px',
        backgroundColor: 'rgb(233, 236, 240)',
        color: 'rgb(16, 16, 16)',
        fontFamily: 'Montserrat, sans-serif',
        textTransform: 'none',
        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 8px 0px, rgb(233, 236, 240) 0px 8px 0px',
        fontSize: '15px',
        minHeight: '65px',
        padding: '8px',
        margin: '16px 0px',
        border: '2px solid rgb(16, 16, 16)',
        //display: 'flex',
        pointerEvents: 'auto',
        transition: 'transform 0.2s', // Adding transition for a smooth effect
        cursor: 'pointer', // Optional: Change cursor on hover
        '&:hover': {
        transform: 'scale(1.05)' // Adjust the scale factor as needed
        }
        
    },
    doneList: {
        //background color grey
        backgroundColor: '#D3D3D3',
        //padding top and bottom 5px
      //  paddingTop: '5px',
      //  paddingBottom: '5px',
        //margin top and bottom 5px
        marginTop: '5px',
        marginBottom: '5px',
        padding: '8px',
    },
    listgroup: {
        display: 'flex',
        justifyContent: 'space-between',
        //top padding
        //paddingTop: '10px',
    },
    listgrouplink: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 10%',
    }
};

export default Home;
