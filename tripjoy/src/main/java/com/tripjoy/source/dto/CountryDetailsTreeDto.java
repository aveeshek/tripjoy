package com.tripjoy.source.dto;

import java.io.Serializable;

public class CountryDetailsTreeDto implements Serializable {

	private static final long serialVersionUID = -4178770483663181315L;
	private long id;
	private String iconCls;
	private String text;
	private boolean leaf = true;
	private String href;
	private String hrefTarget;
	private boolean allowDrag = true;
	private String qtip;

	public CountryDetailsTreeDto() {}

	public CountryDetailsTreeDto(final long id, final String iconCls, final String text,
			final boolean leaf, final String href, final String qtip) {
		super();
		this.id = id;
		this.iconCls = iconCls;
		this.text = text;
		this.leaf = leaf;
		this.href = href;
		this.qtip = qtip;
	}


	public CountryDetailsTreeDto(final long id, final String iconCls, final String text,
			final boolean leaf, final String href, final String hrefTarget, final boolean allowDrag,
			final String qtip) {
		super();
		this.id = id;
		this.iconCls = iconCls;
		this.text = text;
		this.leaf = leaf;
		this.href = href;
		this.hrefTarget = hrefTarget;
		this.allowDrag = allowDrag;
		this.qtip = qtip;
	}


	public long getId() {
		return id;
	}
	public void setId(final long id) {
		this.id = id;
	}
	public String getIconCls() {
		return iconCls;
	}
	public void setIconCls(final String iconCls) {
		this.iconCls = iconCls;
	}
	public String getText() {
		return text;
	}
	public void setText(final String text) {
		this.text = text;
	}
	public boolean isLeaf() {
		return leaf;
	}
	public void setLeaf(final boolean leaf) {
		this.leaf = leaf;
	}
	public String getHref() {
		return href;
	}
	public void setHref(final String href) {
		this.href = href;
	}
	public String getHrefTarget() {
		return hrefTarget;
	}
	public void setHrefTarget(final String hrefTarget) {
		this.hrefTarget = hrefTarget;
	}
	public boolean isAllowDrag() {
		return allowDrag;
	}
	public void setAllowDrag(final boolean allowDrag) {
		this.allowDrag = allowDrag;
	}
	public String getQtip() {
		return qtip;
	}
	public void setQtip(final String qtip) {
		this.qtip = qtip;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + (allowDrag ? 1231 : 1237);
		result = prime * result + (href == null ? 0 : href.hashCode());
		result = prime * result
				+ (hrefTarget == null ? 0 : hrefTarget.hashCode());
		result = prime * result + (iconCls == null ? 0 : iconCls.hashCode());
		result = prime * result + (int) (id ^ id >>> 32);
		result = prime * result + (leaf ? 1231 : 1237);
		result = prime * result + (qtip == null ? 0 : qtip.hashCode());
		result = prime * result + (text == null ? 0 : text.hashCode());
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
		CountryDetailsTreeDto other = (CountryDetailsTreeDto) obj;
		if (allowDrag != other.allowDrag)
			return false;
		if (href == null) {
			if (other.href != null)
				return false;
		} else if (!href.equals(other.href))
			return false;
		if (hrefTarget == null) {
			if (other.hrefTarget != null)
				return false;
		} else if (!hrefTarget.equals(other.hrefTarget))
			return false;
		if (iconCls == null) {
			if (other.iconCls != null)
				return false;
		} else if (!iconCls.equals(other.iconCls))
			return false;
		if (id != other.id)
			return false;
		if (leaf != other.leaf)
			return false;
		if (qtip == null) {
			if (other.qtip != null)
				return false;
		} else if (!qtip.equals(other.qtip))
			return false;
		if (text == null) {
			if (other.text != null)
				return false;
		} else if (!text.equals(other.text))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "CountryDetailsTree [id=" + id + ", iconCls=" + iconCls
				+ ", text=" + text + ", leaf=" + leaf + ", href=" + href
				+ ", hrefTarget=" + hrefTarget + ", allowDrag=" + allowDrag
				+ ", qtip=" + qtip + "]";
	}

}