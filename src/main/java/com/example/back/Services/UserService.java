package com.example.back.Services;

import com.example.back.Entities.User;

import java.util.List;

public interface    UserService {

    public void assignRoles(String userId, List<String> roles);

    public User addUser(User user);

    public List<User> AddUsers(List<User> users);

    public User UpdateUser(User u );

    public void DeleteUserByUserName(String username) ;

    public List<User> GetAllUsers();

    public User GetUserByEmail(String email);

    public User GetUserByUserName(String username);





    User findById(Long idadmin);
}
