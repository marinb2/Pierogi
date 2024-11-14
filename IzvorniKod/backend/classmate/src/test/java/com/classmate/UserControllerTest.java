package com.classmate;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.classmate.controller.UserController;
import com.classmate.model.User;
import com.classmate.service.UserService;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    @WithMockUser(username="testuser", roles={"USER"})
    public void shouldReturnListOfUsers() throws Exception {
        // Mock podaci
        User user1 = new User();
        user1.setUsername("testuser1");
        user1.setEmail("test1@example.com");

        User user2 = new User();
        user2.setUsername("testuser2");
        user2.setEmail("test2@example.com");

        List<User> users = Arrays.asList(user1, user2);

        // Kada `getAllUsers` metoda bude pozvana, vrati mock listu korisnika
        when(userService.getAllUsers()).thenReturn(users);

        // Izvrši GET zahtjev prema /api/users
        mockMvc.perform(MockMvcRequestBuilders.get("/api/users"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$", hasSize(2)))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].username", is("testuser1")))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].username", is("testuser2")));
    }
}
