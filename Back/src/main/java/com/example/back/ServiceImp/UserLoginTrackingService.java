package com.example.back.ServiceImp;

import com.example.back.SecurityConfig.KeycloakConfig;
import eu.bitwalker.useragentutils.UserAgent;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserLoginTrackingService {

    private final Map<String, List<Map<String, String>>> loginHistory = new HashMap<>();

    public void trackUserLogin(String username, HttpServletRequest request) {
        String ipAddress = getClientIP(request);
        String deviceDetails = request.getHeader("User-Agent");

        if (deviceDetails == null || deviceDetails.isEmpty()) {
            deviceDetails = "Google Chrome";
        }

        String timestamp = new Date().toString();

        loginHistory.putIfAbsent(username, new ArrayList<>());
        loginHistory.get(username).add(Map.of(
                "device", deviceDetails,
                "ip", ipAddress,
                "timestamp", timestamp
        ));

        log.info("✅ User {} logged in from: {} - {}", username, ipAddress, deviceDetails);
    }



    public List<Map<String, String>> getLoginHistory(String username) {
        return loginHistory.getOrDefault(username, List.of());
    }

    private String getClientIP(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
