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

		TourDto tourDto = new TourDto();

		try {
			if(countryId == 1L) {
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
				tourDto.setCountryDetailsTreeDtos(detailsTrees);
				tourDto.setMapImage("France.png");
				File file = new File(this.getClass().getClassLoader().getResource("images/map/France.png").getFile());
				BufferedImage bimg = ImageIO.read(file);
				tourDto.setHeight(bimg.getHeight());
				tourDto.setWidth(bimg.getWidth());
			} else if(countryId == 2L) {
				List<CountryDetailsTreeDto> detailsTrees = new ArrayList<CountryDetailsTreeDto>();
				detailsTrees.add(new CountryDetailsTreeDto(1L, "x-tree-noicon", "PEOPLE (32)", true, "#", "People at this place"));
				detailsTrees.add(new CountryDetailsTreeDto(2L, "x-tree-noicon", "PLACES TO STAY", true, "#", "People at this place"));
				detailsTrees.add(new CountryDetailsTreeDto(3L, "x-tree-noicon", "PLACES TO EAT", true, "#", "People at this place"));
				detailsTrees.add(new CountryDetailsTreeDto(4L, "x-tree-noicon", "PLACES TO SHOP", true, "#", "People at this place"));
				detailsTrees.add(new CountryDetailsTreeDto(5L, "x-tree-noicon", "PLACE TO SEE", true, "#", "People at this place"));
				detailsTrees.add(new CountryDetailsTreeDto(6L, "x-tree-noicon", "EVENTS", true, "#", "People at this place"));
				detailsTrees.add(new CountryDetailsTreeDto(7L, "x-tree-noicon", "PLACES TO TRACKING", true, "#", "People at this place"));
				detailsTrees.add(new CountryDetailsTreeDto(8L, "x-tree-noicon", "PLACES FOR SHORT DISTANCE", true, "#", "People at this place"));
				detailsTrees.add(new CountryDetailsTreeDto(0L, "x-tree-noicon", null, true, null, null));
				tourDto.setCountryDetailsTreeDtos(detailsTrees);
				tourDto.setMapImage("Italy.png");
				File file = new File(this.getClass().getClassLoader().getResource("images/map/Italy.png").getFile());
				BufferedImage bimg = ImageIO.read(file);
				tourDto.setHeight(bimg.getHeight());
				tourDto.setWidth(bimg.getWidth());
			} else if(countryId == 3l) {
				List<CountryDetailsTreeDto> detailsTrees = new ArrayList<CountryDetailsTreeDto>();
				detailsTrees.add(new CountryDetailsTreeDto(1L, "x-tree-noicon", "PEOPLE (112)", true, "#", "People at this place"));
				detailsTrees.add(new CountryDetailsTreeDto(2L, "x-tree-noicon", "PLACES TO STAY", true, "#", "People at this place"));
				detailsTrees.add(new CountryDetailsTreeDto(3L, "x-tree-noicon", "PLACES TO EAT", true, "#", "People at this place"));
				detailsTrees.add(new CountryDetailsTreeDto(4L, "x-tree-noicon", "PLACES TO SHOP", true, "#", "People at this place"));
				detailsTrees.add(new CountryDetailsTreeDto(5L, "x-tree-noicon", "PLACE TO SEE", true, "#", "People at this place"));
				detailsTrees.add(new CountryDetailsTreeDto(6L, "x-tree-noicon", "EVENTS", true, "#", "People at this place"));
				detailsTrees.add(new CountryDetailsTreeDto(7L, "x-tree-noicon", "PLACES TO TRACKING", true, "#", "People at this place"));
				detailsTrees.add(new CountryDetailsTreeDto(8L, "x-tree-noicon", "PLACES FOR SHORT DISTANCE", true, "#", "People at this place"));
				detailsTrees.add(new CountryDetailsTreeDto(0L, "x-tree-noicon", null, true, null, null));
				tourDto.setCountryDetailsTreeDtos(detailsTrees);
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

	@RequestMapping(value = "getPlaces", method=RequestMethod.GET)
	public @ResponseBody
	JsonResponse getPlaceDetails() {
		System.out.println("Get the places ----------------------------------- ");
		class PlaceDto {
			public PlaceDto (final String id, final String place) {
				this.id = id;
				this.place = place;
			}
			private final String id;
			private final String place;

			@SuppressWarnings("unused")
			public String getId() {
				return id;
			}

			@SuppressWarnings("unused")
			public String getPlace() {
				return place;
			}
		}
		List<PlaceDto> countries = new ArrayList<PlaceDto>();
		countries.add(new PlaceDto("Naples", "Naples"));
		countries.add(new PlaceDto("Sicily", "Sicily"));
		countries.add(new PlaceDto("Cinque Terre", "Cinque Terre"));
		countries.add(new PlaceDto("Milan", "Milan"));
		countries.add(new PlaceDto("Amalfi Coast", "Amalfi Coast"));
		countries.add(new PlaceDto("Pompeii", "Pompeii"));
		countries.add(new PlaceDto("Venice", "Venice"));
		countries.add(new PlaceDto("Tuscany", "Tuscany"));
		countries.add(new PlaceDto("Rome", "Rome"));
		countries.add(new PlaceDto("Lake Garda", "Lake Garda"));
		countries.add(new PlaceDto("Lake Como", "Lake Como"));
		countries.add(new PlaceDto("Lake Maggiore", "Lake Maggiore"));
		countries.add(new PlaceDto("Lake District", "Lake District"));
		countries.add(new PlaceDto("Monreale", "Monreale"));
		countries.add(new PlaceDto("Erice", "Erice"));
		countries.add(new PlaceDto("Doric Temple of Segesta", "Doric Temple of Segesta"));
		countries.add(new PlaceDto("Villa Romana del Casale", "Villa Romana del Casale"));
		countries.add(new PlaceDto("Syracuse", "Syracuse"));
		countries.add(new PlaceDto("Palermo", "Palermo"));
		countries.add(new PlaceDto("Aeolian Islands", "Aeolian Islands"));
		countries.add(new PlaceDto("Taormina", "Taormina"));
		countries.add(new PlaceDto("Mount Etna", "Mount Etna"));
		countries.add(new PlaceDto("Valley of the Temples", "Valley of the Temples"));
		countries.add(new PlaceDto("Arezzo", "Arezzo"));
		countries.add(new PlaceDto("Montepulciano", "Montepulciano"));
		countries.add(new PlaceDto("Val d'Orcia", "Val d'Orcia"));
		countries.add(new PlaceDto("Elba", "Elba"));
		countries.add(new PlaceDto("San Gimignano", "San Gimignano"));
		countries.add(new PlaceDto("Lucca", "Lucca"));
		countries.add(new PlaceDto("Chianti Wine Region", "Chianti Wine Region"));
		countries.add(new PlaceDto("Pisa", "Pisa"));
		countries.add(new PlaceDto("Florence", "Florence"));
		JsonResponse response = new JsonResponse();
		response.setResult(countries);
		response.setStatus("success");
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