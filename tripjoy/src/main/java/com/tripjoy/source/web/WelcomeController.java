package com.tripjoy.source.web;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.tripjoy.source.dto.CountryDetailsTreeDto;
import com.tripjoy.source.dto.CountryDto;
import com.tripjoy.source.dto.JsonResponse;

@Controller
@RequestMapping("/welcome")
public class WelcomeController {

	@RequestMapping(value = "getCountry", method=RequestMethod.GET)
	public @ResponseBody
	JsonResponse getCountryDetails() {
		List<CountryDto> countries = new ArrayList<CountryDto>();
		countries.add(new CountryDto(1L, "FRANCE"));
		countries.add(new CountryDto(2L, "ITALY"));
		countries.add(new CountryDto(3L, "GREECE"));
		JsonResponse response = new JsonResponse();
		response.setResult(countries);
		response.setStatus("success");
		return response;
	}

	@RequestMapping(value = "getCountryDetails", method=RequestMethod.GET)
	public @ResponseBody
	JsonResponse getCountryTourDetails(
			@RequestParam(value="countryId", required=true) final long countryId) {
		List<CountryDetailsTreeDto> detailsTrees = new ArrayList<CountryDetailsTreeDto>();
		detailsTrees.add(new CountryDetailsTreeDto(1L, "x-tree-noicon", "PEOPLE (192)", true, "#", "People at this place"));
		detailsTrees.add(new CountryDetailsTreeDto(2L, "x-tree-noicon", "PLACES TO STAY", true, "#", "People at this place"));
		detailsTrees.add(new CountryDetailsTreeDto(3L, "x-tree-noicon", "PLACES TO EAT", true, "#", "People at this place"));
		detailsTrees.add(new CountryDetailsTreeDto(4L, "x-tree-noicon", "PLACES TO SHOP", true, "#", "People at this place"));
		detailsTrees.add(new CountryDetailsTreeDto(5L, "x-tree-noicon", "PLACE TO SEE", true, "#", "People at this place"));
		detailsTrees.add(new CountryDetailsTreeDto(6L, "x-tree-noicon", "EVENTS", true, "#", "People at this place"));
		detailsTrees.add(new CountryDetailsTreeDto(7L, "x-tree-noicon", "PLACES TO TRACKING", true, "#", "People at this place"));
		detailsTrees.add(new CountryDetailsTreeDto(8L, "x-tree-noicon", "PLACES FOR SHORT DISTANCE", true, "#", "People at this place"));
		detailsTrees.add(new CountryDetailsTreeDto(0L, "x-tree-noicon", null, true, null, null));
		JsonResponse response = new JsonResponse();
		response.setStatus("success");
		response.setResult(detailsTrees);
		return response;
	}

}