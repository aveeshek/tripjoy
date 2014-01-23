package com.tripjoy.source.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class TripJoyPageNavigationController {

	@RequestMapping(value="/", method=RequestMethod.GET)
	public String welcomeView() {
		System.out.println("showing welcome page");
		return "welcome";
	}

	@RequestMapping(value="/signin", method=RequestMethod.GET)
	public String signinView() {
		System.out.println("showing signin page");
		return "login";
	}

}