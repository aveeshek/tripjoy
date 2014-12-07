package com.tripjoy.source.dto;

import java.util.List;

public class TourDto {

	private List<CountryDto> countryDtos;

	private List<CountryDetailsTreeDto> countryDetailsTreeDtos;

	private String mapImage;

	private int height;

	private int width;

	public List<CountryDto> getCountryDtos() {
		return countryDtos;
	}

	public void setCountryDtos(final List<CountryDto> countryDtos) {
		this.countryDtos = countryDtos;
	}

	public List<CountryDetailsTreeDto> getCountryDetailsTreeDtos() {
		return countryDetailsTreeDtos;
	}

	public void setCountryDetailsTreeDtos(
			final List<CountryDetailsTreeDto> countryDetailsTreeDtos) {
		this.countryDetailsTreeDtos = countryDetailsTreeDtos;
	}

	public String getMapImage() {
		return mapImage;
	}

	public void setMapImage(final String mapImage) {
		this.mapImage = mapImage;
	}

	public int getHeight() {
		return height;
	}

	public void setHeight(final int height) {
		this.height = height;
	}

	public int getWidth() {
		return width;
	}

	public void setWidth(final int width) {
		this.width = width;
	}

}