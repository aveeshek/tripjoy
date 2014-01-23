package com.tripjoy.source.web;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.tripjoy.source.dto.CountryDto;
import com.tripjoy.source.dto.JsonResponse;

@Controller
@RequestMapping("/welcome")
public class WelcomeController {

	@RequestMapping(value = "getCountry", method=RequestMethod.GET)
	public @ResponseBody
	JsonResponse getCountryDetails() {
		List<CountryDto> countries = new ArrayList<CountryDto>();
		countries.add(new CountryDto(1, "FRANCE"));
		countries.add(new CountryDto(2, "ITALY"));
		countries.add(new CountryDto(3, "GREECE"));
		JsonResponse response = new JsonResponse();
		response.setResult(countries);
		response.setStatus("success");
		return response;
	}

}