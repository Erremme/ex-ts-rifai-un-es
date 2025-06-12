type City  = {
  name : string,
  country : string,
  temperature : number,
  weather_description : string,
  airport :string

}

function isCity(dati : unknown) : dati is City {
    if(
       dati instanceof Object &&
      "name" in dati && typeof dati.name === "string" &&
      "country" in dati && typeof dati.country === "string" &&
      "temperature" in dati && typeof dati.temperature === "number" &&
      "weather_description" in dati && typeof dati.weather_description === "string" &&
      "airport" in dati && typeof dati.airport === "string" 
    ){
      return true
    }

    return false
}


async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } 
  return response.json();
}



export default function App(){
async function getDashboardData(query : string) : Promise<City  | null>{

   try {
  const destinationPromis  = fetchJson(`http://localhost:5000/destinations?search=${query}`)
  const weatherPromis  = fetchJson(`http://localhost:5000/weathers?search=${query}`)
  const airportPromise = fetchJson(`http://localhost:5000/airports?search=${query}`)

  

  const promises = [destinationPromis, weatherPromis, airportPromise]
  const [destinationResult, weatherResult, airportResult] = await Promise.all(promises)

  
   const validateCity : City = {
    name : "",
    country : "",
    temperature :0,
    weather_description : "",
    airport: ""
   }

  if(destinationResult){
    const destination = Array.isArray(destinationResult) ?  destinationResult[0] : destinationResult;
    console.log("DESTINATION :"  ,destination,
    )
     validateCity.name = destination.name 
    validateCity.country = destination.country
  }

  if(weatherResult){
    const weather = Array.isArray(weatherResult) ? weatherResult[0] : weatherResult
    console.log("WEATHER:", weather)
    validateCity.temperature = weather.temperature
    validateCity.weather_description = weather.weather_description
  }

  if(airportResult){
    const airport = Array.isArray(airportResult) ? airportResult[0] : airportResult
    console.log("AIRPORT:"  , airport)
    validateCity.airport =  airport.name
  }

  if(!isCity(validateCity)){
    throw new Error("Errore nei dati ricevuti")
  }
  return validateCity

    }catch(error) {
    if(error instanceof Error){
      console.error(error)
    }
  }
     return null   
}

getDashboardData("london")
.then((res) => {
  if(res){
    console.log(
            `${res.name} is in ${res.country}.\n` +
            `Today there are ${res.temperature} degrees and the weather is ${res.weather_description}.\n`+
            `The main airport is ${res.airport}.\n`
        );
  }
} )
.catch(error => console.error(error))

  return(
    <div>Hello</div>
  )
}