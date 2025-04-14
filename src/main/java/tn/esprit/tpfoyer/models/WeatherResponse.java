package tn.esprit.tpfoyer.models;

public class WeatherResponse {
    private String city;
    private double temperature;
    private String description;

    // Getters and setters
    public String getCity() {
        return city;
    }
    public void setCity(String city) {
        this.city = city;
    }

    public double getTemperature() {
        return temperature;
    }
    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
}
