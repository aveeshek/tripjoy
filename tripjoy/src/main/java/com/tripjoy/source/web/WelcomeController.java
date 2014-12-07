package com.tripjoy.source.web;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.tripjoy.source.dto.CountryDetailsTreeDto;
import com.tripjoy.source.dto.CountryDto;
import com.tripjoy.source.dto.JsonResponse;
import com.tripjoy.source.dto.TourDto;

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
		TourDto tourDto = new TourDto();
		tourDto.setCountryDetailsTreeDtos(detailsTrees);

		try {
			if(countryId == 1L) {
				tourDto.setMapImage("France.png");
				File file = new File(this.getClass().getClassLoader().getResource("images/map/France.png").getFile());
				BufferedImage bimg = ImageIO.read(file);
				tourDto.setHeight(bimg.getHeight());
				tourDto.setWidth(bimg.getWidth());
			} else if(countryId == 2L) {
				tourDto.setMapImage("Italy.png");
				File file = new File(this.getClass().getClassLoader().getResource("images/map/Italy.png").getFile());
				BufferedImage bimg = ImageIO.read(file);
				tourDto.setHeight(bimg.getHeight());
				tourDto.setWidth(bimg.getWidth());
			} else if(countryId == 3l) {
				tourDto.setMapImage("Greece.png");
				File file = new File(this.getClass().getClassLoader().getResource("images/map/Greece.png").getFile());
				BufferedImage bimg = ImageIO.read(file);
				tourDto.setHeight(bimg.getHeight());
				tourDto.setWidth(bimg.getWidth());
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		JsonResponse response = new JsonResponse();
		response.setStatus("success");
		response.setResult(tourDto);
		return response;
	}

	@RequestMapping(value = "/countryImage",
			headers = "Accept=image/jpeg, image/jpg, image/png, image/gif",
			method = RequestMethod.GET)
	public @ResponseBody BufferedImage getImage() {
		try {
			InputStream inputStream = new FileInputStream(new File(this.getClass().getClassLoader().getResource("images/map/France.png").getFile()));
			return ImageIO.read(inputStream);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	public static void main (final String[] args) throws IOException {
		InputStream inputStream = new FileInputStream(new File(new WelcomeController().getClass().getClassLoader().getResource("images/map/France.png").getFile()));
		System.out.println(ImageIO.read(inputStream));
	}

}