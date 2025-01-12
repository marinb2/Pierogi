package com.classmate.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.classmate.model.EstablishedConvos;
import com.classmate.model.User;
import com.classmate.repository.EstablishedConvosRepository;
import com.classmate.repository.UserRepository;

@Service
public class EstablishedConvosService {

    @Autowired
    private EstablishedConvosRepository establishedConvosRepository;
    @Autowired
    private UserRepository userRepository;

    public List<EstablishedConvos> getallEstablishedConvos() {
        return establishedConvosRepository.findAll();
    }

    public EstablishedConvos createConvo(EstablishedConvos establishedConvos) {
        return establishedConvosRepository.save(establishedConvos);
    }

    // gets all the established converstaions for one user
    public List<EstablishedConvos> getEstConvosByUserId(Long id) {
        List<EstablishedConvos> user_convos = new ArrayList<EstablishedConvos>();
        List<EstablishedConvos> all_convos = establishedConvosRepository.findAll();

        for (int i = 0; i < all_convos.size(); i++) {
            if (all_convos.get(i).getUser1().getUserId().equals(id) ||
                    all_convos.get(i).getUser2().getUserId().equals(id)) {
                user_convos.add(all_convos.get(i));
            }
        }
        return user_convos;
    }

    // gets all the non-established converstaions for one user
    public List<User> getNonEstConvosByUserId(Long id) {
        List<EstablishedConvos> user_convos = new ArrayList<EstablishedConvos>();
        List<EstablishedConvos> all_convos = establishedConvosRepository.findAll();
        List<User> all_users = userRepository.findAll();
        List<User> users_with_convo_to_user = new ArrayList<User>();
        List<User> users_without_convo_to_user = new ArrayList<User>();

        for (int i = 0; i < all_convos.size(); i++) {
            if (all_convos.get(i).getUser1().getUserId().equals(id) ||
                    all_convos.get(i).getUser2().getUserId().equals(id)) {
                user_convos.add(all_convos.get(i));
            }
        }
        System.out.println(
                "1-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*");
        for (int i = 0; i < all_convos.size(); i++)
            System.out.println(all_convos.get(i).getId());

        for (int i = 0; i < user_convos.size(); i++) {
            for (int j = 0; j < all_users.size(); j++) {
                if (
                    (user_convos.get(i).getUser1().getUserId().equals(all_users.get(j).getUserId()) && !(user_convos.get(i).getUser1().getUserId().equals(id))) ||
                    (user_convos.get(i).getUser2().getUserId().equals(all_users.get(j).getUserId()) && !(user_convos.get(i).getUser2().getUserId().equals(id)))
                   )
                {
                    users_with_convo_to_user.add(all_users.get(j));
                }
            }
        }
        System.out.println(
                "2-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*");
        for (int i = 0; i < users_with_convo_to_user.size(); i++)
            System.out.println(users_with_convo_to_user.get(i).getUserId());

        boolean changes;

        do {
            changes = false;
            for (int i = 0; i < all_users.size(); i++) {
                for (int j = 0; j < users_with_convo_to_user.size(); j++) {
                    if (all_users.get(i).getUserId().equals(users_with_convo_to_user.get(j).getUserId())) {
                        changes = true;
                        all_users.remove(i);
                        users_with_convo_to_user.remove(j);
                        break;
                    }
                }
                if (changes)
                    break;
            }
        } while (changes);
        System.out.println(
                "3-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*");
        for (int i = 0; i < all_users.size(); i++)
            System.out.println(all_users.get(i).getUserId());
        if (all_users.size() == 0)
            System.out.println("empty");
        for (int i = 0; i < all_users.size(); i++) {
            if (all_users.get(i).getUserId().equals(id)) {
                all_users.remove(i);
            }
        }

        users_without_convo_to_user = all_users;
        System.out.println(
                "4-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*");
        for (int i = 0; i < users_without_convo_to_user.size(); i++) {
            System.out.println(users_without_convo_to_user.get(i).getUserId());
        }
        return users_without_convo_to_user;
    }
}
