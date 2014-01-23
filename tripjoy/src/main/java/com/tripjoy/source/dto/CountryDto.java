package com.tripjoy.source.dto;

public class CountryDto {

	private int id;

	private String countryName;

	public CountryDto() {

	}

	public CountryDto(final int id, final String countryName) {
		this.id = id;
		this.countryName = countryName;
	}

	public int getId() {
		return id;
	}

	public void setId(final int id) {
		this.id = id;
	}

	public String getcountryName() {
		return countryName;
	}

	public void setcountryName(final String countryName) {
		this.countryName = countryName;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime
				* result
				+ (countryName == null ? 0 : countryName
						.hashCode());
		result = prime * result + id;
		return result;
	}

	@Override
	public boolean equals(final Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		CountryDto other = (CountryDto) obj;
		if (countryName == null) {
			if (other.countryName != null)
				return false;
		} else if (!countryName.equals(other.countryName))
			return false;
		if (id != other.id)
			return false;
		return true;
	}

}
