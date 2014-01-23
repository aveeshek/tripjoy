/************************************************************************************
 * File: JsonResponse.java
 *
 * Created: August-10-12
 *
 * Copyright 2012-2013 Association of American Medical Colleges. All Rights Reserved.
 *
 * Legal copyright notice goes here.
 *
 * Author: adutta@aamc.org
 *
 *************************************************************************************/

package com.tripjoy.source.dto;

/**
 * The Class JsonResponse.
 * 
 * @author adutta@aamc.org
 */
public class JsonResponse {

	private String status = null;

	private Object result = null;

	/**
	 * Gets the status.
	 * 
	 * @return the status
	 */
	public String getStatus() {
		return status;
	}

	/**
	 * Sets the status.
	 * 
	 * @param status
	 *          the new status
	 */
	public void setStatus(final String status) {
		this.status = status;
	}

	/**
	 * Gets the result.
	 * 
	 * @return the result
	 */
	public Object getResult() {
		return result;
	}

	/**
	 * Sets the result.
	 * 
	 * @param result
	 *          the new result
	 */
	public void setResult(final Object result) {
		this.result = result;
	}

}