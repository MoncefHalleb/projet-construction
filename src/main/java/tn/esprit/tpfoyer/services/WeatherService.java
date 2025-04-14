package tn.esprit.tpfoyer.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import tn.esprit.tpfoyer.models.WeatherResponse;
import org.json.JSONObject;
import java.util.logging.Logger;

@Service
public class WeatherService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final Logger LOGGER = Logger.getLogger(WeatherService.class.getName());

    @Value("${openweathermap.api.key}")
    private String apiKey;

    public WeatherResponse  getWeather(String city) {
        try {
            String url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric";
            LOGGER.info("Requesting weather data from: " + url);

            // Make the API call
            String jsonResponse = restTemplate.getForObject(url, String.class);
            if (jsonResponse == null || jsonResponse.trim().isEmpty()) {
                LOGGER.severe("Empty or null response from OpenWeatherMap API");
                throw new RuntimeException("No response received from OpenWeatherMap API");
            }
            LOGGER.info("Raw API Response: " + jsonResponse);

            // Parse JSON
            JSONObject jsonObject = new JSONObject(jsonResponse);
            LOGGER.info("Parsed JSON: " + jsonObject.toString());

            // Check for API error
            if (jsonObject.has("cod") && jsonObject.getInt("cod") != 200) {
                String message = jsonObject.getString("message");
                LOGGER.severe("API Error - Code: " + jsonObject.getInt("cod") + ", Message: " + message);
                throw new RuntimeException("API Error: " + message);
            }

            // Map to WeatherResponse
            WeatherResponse response = new WeatherResponse();
            response.setCity(jsonObject.getString("name"));
            response.setTemperature(jsonObject.getJSONObject("main").getDouble("temp"));
            response.setDescription(jsonObject.getJSONArray("weather").getJSONObject(0).getString("description"));

            LOGGER.info("WeatherResponse created: city=" + response.getCity() +
                    ", temp=" + response.getTemperature() +
                    ", desc=" + response.getDescription());
            return response;

        } catch (HttpClientErrorException e) {
            LOGGER.severe("HTTP Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            throw new RuntimeException("Weather API request failed: " + e.getMessage());
        } catch (Exception e) {
            LOGGER.severe("Error processing weather data for " + city + ": " + e.getMessage());
            throw new RuntimeException("Error fetching weather data for " + city + ": " + e.getMessage());
        }
    }
}