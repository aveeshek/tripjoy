package com.tripjoy.configuration.bootstrapper;

import javax.servlet.FilterRegistration;
import javax.servlet.ServletContext;
import javax.servlet.ServletRegistration;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.filter.HiddenHttpMethodFilter;
import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.util.Log4jConfigListener;

import com.tripjoy.configuration.spring.ApplicationContextBean;
import com.tripjoy.configuration.spring.WebServletContext;

@EnableAutoConfiguration
public class WebApp implements WebApplicationInitializer  {

	private final String DISPLAY_NAME = "display-name";
	private final String DISPlAY_VALUE = "Social Travels & Dynamic Deals";
	private final String LOG4JCONFIGLOCATION = "log4jConfigLocation";
	private final String LOG4JCONFIGLOCATION_PATH = "classpath:log4j.properties";
	private final String DEFAULTHTMLESCAPE = "defaultHtmlEscape";
	private final String TRUE_VALUE = "true";
	private final String DISPATCHER_SERVLET = "dispatcherServlet";
	private final String ROOT_CONTEXT_PATH = "/";
	private final String ROOT_CONTXT_PATH_ALL = "/*";
	private final String HTTP_METHOD_FILTER = "HttpMethodFilter";
	private final String CHARECTER_EMCODING_FILTER = "CharacterEncodingFilter";
	private final String ENCODING = "encoding";
	private final String FORCE_ENCODING = "forceEncoding";
	private final String UTF_8 = "UTF-8";

	/** (non-Javadoc)
	 * 
	 *  <display-name>tripjoy</display-name>
	 *  <description>Social Travels &amp; Dynamic Deals</description>
	 * 
	 * 	<context-param>
	 *  	<param-name>log4jConfigLocation</param-name>
	 *      <param-value>classpath:log4j.properties</param-value>
	 *  </context-param>
	 * 
	 * 	<listener>
	 * 		<listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
	 * 	</listener>
	 * 
	 * 	<context-param>
	 * 		<param-name>defaultHtmlEscape</param-name>
	 * 		<param-value>true</param-value>
	 * 	</context-param>
	 * 
	 * 	<context-param>
	 * 		<param-name>contextConfigLocation</param-name>
	 * 		<param-value>
	 * 			classpath:root-context.xml
	 * 			classpath:applicationContext-security.xml
	 * 		</param-value>
	 * 	</context-param>
	 * 
	 * 	<listener>
	 * 		<listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
	 * 	</listener>
	 * 
	 * 	<servlet>
	 * 		<servlet-name>dispatcherServlet</servlet-name>
	 * 		<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
	 * 		<init-param>
	 * 			<param-name>contextConfigLocation</param-name>
	 * 			<param-value>classpath:servlet-context.xml</param-value>
	 * 		</init-param>
	 * 		<load-on-startup>1</load-on-startup>
	 * 	</servlet>
	 * 
	 * 	<servlet-mapping>
	 * 		<servlet-name>dispatcherServlet</servlet-name>
	 * 		<url-pattern>/</url-pattern>
	 * 	</servlet-mapping>
	 * 
	 * 	<filter>
	 * 		<filter-name>HttpMethodFilter</filter-name>
	 * 		<filter-class>org.springframework.web.filter.HiddenHttpMethodFilter</filter-class>
	 * 	</filter>
	 * 
	 * 	<filter-mapping>
	 * 		<filter-name>CharacterEncodingFilter</filter-name>
	 * 		<url-pattern>/*</url-pattern>
	 * 	</filter-mapping>
	 * 
	 * 	<filter>
	 * 		<filter-name>CharacterEncodingFilter</filter-name>
	 * 		<filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
	 * 		<init-param>
	 * 			<param-name>encoding</param-name>
	 * 			<param-value>UTF-8</param-value>
	 * 		</init-param>
	 * 		<init-param>
	 * 			<param-name>forceEncoding</param-name>
	 * 			<param-value>true</param-value>
	 * 		</init-param>
	 * 	</filter>
	 * 
	 * 	<filter-mapping>
	 * 		<filter-name>CharacterEncodingFilter</filter-name>
	 * 		<url-pattern>/*</url-pattern>
	 * 	</filter-mapping>
	 *
	 * 
	 * @see org.springframework.web.WebApplicationInitializer#onStartup(javax.servlet.ServletContext)
	 */
	@Override
	public void onStartup(final ServletContext container) {

		System.out.println("**************** Initializing Web.xml *********************");

		container.setAttribute(DISPLAY_NAME, DISPlAY_VALUE);

		container.setInitParameter(LOG4JCONFIGLOCATION, LOG4JCONFIGLOCATION_PATH);
		container.addListener(Log4jConfigListener.class);

		container.setInitParameter(DEFAULTHTMLESCAPE, TRUE_VALUE);

		AnnotationConfigWebApplicationContext rootContext = new AnnotationConfigWebApplicationContext();
		rootContext.register(ApplicationContextBean.class);
		container.addListener(new ContextLoaderListener(rootContext));

		/*XmlWebApplicationContext rootContext = new XmlWebApplicationContext();
        rootContext.setConfigLocations({"classpath:WEB-INF/spring/applicationContext-security.xml"});*/

		AnnotationConfigWebApplicationContext dispatcherContext = new AnnotationConfigWebApplicationContext();
		dispatcherContext.register(WebServletContext.class);
		ServletRegistration.Dynamic dispatcher = container.addServlet(DISPATCHER_SERVLET, new DispatcherServlet(dispatcherContext));
		dispatcher.setAsyncSupported(true);
		dispatcher.setLoadOnStartup(1);
		dispatcher.addMapping(ROOT_CONTEXT_PATH);

		/*container.addFilter("Spring OpenEntityManagerInViewFilter", org.springframework.orm.jpa.support.OpenEntityManagerInViewFilter.class)
         .addMappingForUrlPatterns(null, false, ROOT_CONTXT_PATH_ALL);
        container.addFilter("springSecurityFilterChain", new DelegatingFilterProxy("springSecurityFilterChain"))
           .addMappingForUrlPatterns(null, false, ROOT_CONTXT_PATH_ALL);*/

		container.addFilter(HTTP_METHOD_FILTER, HiddenHttpMethodFilter.class).addMappingForUrlPatterns(null, false, ROOT_CONTXT_PATH_ALL);

		FilterRegistration charEncodingfilterReg = container.addFilter(CHARECTER_EMCODING_FILTER, CharacterEncodingFilter.class);
		charEncodingfilterReg.setInitParameter(ENCODING, UTF_8);
		charEncodingfilterReg.setInitParameter(FORCE_ENCODING, TRUE_VALUE);
		charEncodingfilterReg.addMappingForUrlPatterns(null, false, ROOT_CONTXT_PATH_ALL);
	}

}