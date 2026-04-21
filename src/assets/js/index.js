$(function () {
	const COOKIE_CONSENT_KEY = "cista_kuca_cookie_consent_v1";
	const burgerMenu = document.getElementById("burger");
	const navbarMenu = document.getElementById("menu");

	function setCookieConsent(consent) {
		localStorage.setItem(
			COOKIE_CONSENT_KEY,
			JSON.stringify({
				consent: consent,
				updatedAt: new Date().toISOString(),
			})
		);
		document.documentElement.setAttribute("data-cookie-consent", consent);
	}

	function getCookieConsent() {
		try {
			const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
			if (!raw) {
				return null;
			}

			const parsed = JSON.parse(raw);
			return parsed && parsed.consent ? parsed.consent : null;
		} catch (error) {
			return null;
		}
	}

	function initCookieBanner() {
		const savedConsent = getCookieConsent();

		if (savedConsent) {
			document.documentElement.setAttribute("data-cookie-consent", savedConsent);
			return;
		}

		const banner = document.createElement("div");
		banner.className = "cookie-banner";
		banner.innerHTML =
			'<div class="cookie-banner__content">' +
			"<p><strong>Kolačići</strong> koristimo radi rada sajta i unapređenja iskustva. Možete prihvatiti sve ili zadržati samo neophodne kolačiće.</p>" +
			'<div class="cookie-banner__actions">' +
			'<a href="/kolacici.html" class="cookie-banner__link">Saznaj više</a>' +
			'<button type="button" class="btn-secondary cookie-banner__btn" data-consent="necessary">Samo neophodni</button>' +
			'<button type="button" class="btn cookie-banner__btn" data-consent="all">Prihvati sve</button>' +
			"</div>" +
			"</div>";

		document.body.appendChild(banner);

		banner.querySelectorAll(".cookie-banner__btn").forEach(function (button) {
			button.addEventListener("click", function () {
				setCookieConsent(button.getAttribute("data-consent"));
				banner.remove();
			});
		});
	}

	// Responsive Navbar Toggle
	if (burgerMenu && navbarMenu) {
		burgerMenu.addEventListener("click", function () {
			navbarMenu.classList.toggle("active");
			burgerMenu.classList.toggle("active");
		});
	}

	// Homepage Sliders
	$(".sliders").slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
		infinite: true,
		speed: 500,
		cssEase: "linear",
		autoplay: false,
		dots: false,
		swipeToSlide: true,
		autoplaySpeed: 7000,
		fade: true,
	});

	// Services page
	$(".services .tab").on("click", function () {
		event.preventDefault();
		var tab = $(this).attr("data-tab");

		$("html, body").animate(
			{
				scrollTop: $("#services-tabs").offset().top,
			},
			500
		);

		$(".services .tab").removeClass("current");
		$(".services .tab-content").removeClass("current");

		$(this).addClass("current");
		$("#" + tab).addClass("current");
	});

	// Main Nav Sticky Header
	$(window).on("scroll", function () {
		if ($(this).scrollTop() > 200) {
			$("#main-nav").addClass("sticky-header");
		} else {
			$("#main-nav").removeClass("sticky-header");
		}
	});

	// Contact page
	$(".contact-form__text-input").on("keyup", function () {
		if ($(this).val()) {
			$(this).addClass("has-value");
		} else {
			$(this).removeClass("has-value");
		}
	});

	// FAQ
	$(".faq .btn").on("click", function () {
		event.preventDefault();
		var tab = $(this).attr("data-tab");

		$("html, body").animate(
			{
				scrollTop: $("#faq-content").offset().top,
			},
			500
		);

		$(".faq .btn").removeClass("current");
		$(".faq .faq__q-a").removeClass("current");

		$(this).addClass("current");
		$("#" + tab).addClass("current");
	});

	$(".faq__question a").on("click", function () {
		event.preventDefault();
		if ($(this).hasClass("active")) {
			$(this).removeClass("active");
			$(this).siblings(".faq__answer").slideUp(200);
		} else {
			$(".faq__question a").removeClass("active");
			$(this).addClass("active");
			$(".faq__answer").slideUp(200);
			$(this).siblings(".faq__answer").slideDown(200);
		}
	});

	AOS.init();

	initCookieBanner();
});
