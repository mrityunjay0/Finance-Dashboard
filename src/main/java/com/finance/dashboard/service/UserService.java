package com.finance.dashboard.service;

import com.finance.dashboard.entity.User;

import java.util.List;

public interface UserService {

    public User createUser(User user);
    public List<User> getAllUsers();
    public User getUserById(Long id);
    public User updateUser(Long id, User updatedUser);
    public void deleteUser(Long id);
}
