package com.classmate.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.classmate.model.EstablishedConvos;
import com.classmate.model.User;
import com.classmate.service.EstablishedConvosService;

@RestController
@RequestMapping("/api/convos")
public class EstablishedConvosController {

    @Autowired
    private EstablishedConvosService establishedConvosService;

    @GetMapping("/all")
    public List<EstablishedConvos> getAll(){
        return establishedConvosService.getallEstablishedConvos();
    }

    @GetMapping("/byuser-est")
    public List<EstablishedConvos> getEstConvosByUser(@RequestParam Long id) {
        return establishedConvosService.getEstConvosByUserId(id);
    }

    @GetMapping("/byuser-not-est")
    public List<User> getnonEstConvosByUser(@RequestParam Long id) {
        //establishedConvosService.getNonEstConvosByUserId(id);
        return establishedConvosService.getNonEstConvosByUserId(id);
    }

    @PostMapping(value = "", consumes = { "application/json" })
    public EstablishedConvos createConvo(@RequestBody EstablishedConvos establishedConvos) {
        return establishedConvosService.createConvo(establishedConvos);
    }
}
