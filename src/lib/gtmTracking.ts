declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

type GtmPayload = Record<string, unknown>;

function pushToDataLayer(payload: GtmPayload) {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
}

export function trackServiceView(serviceName: string, serviceSlug: string) {
  pushToDataLayer({
    event: "service_view",
    service_name: serviceName,
    service_slug: serviceSlug,
  });
}

export function trackServiceCtaClick(serviceName: string, serviceSlug: string, ctaType: string, ctaPosition: string) {
  pushToDataLayer({
    event: "service_cta_click",
    service_name: serviceName,
    service_slug: serviceSlug,
    cta_type: ctaType,
    cta_position: ctaPosition,
  });
}

export function trackServiceFormSubmission(serviceName: string, serviceSlug: string) {
  pushToDataLayer({
    event: "service_form_submit",
    service_name: serviceName,
    service_slug: serviceSlug,
  });
}

export function trackBookingFormSubmit() {
  const payload = {
    form_name: "multi_step_booking",
    form_location: "home",
  };

  pushToDataLayer({
    event: "booking_form_submit",
    ...payload,
  });

  if (typeof window !== "undefined") {
    window.gtag?.("event", "booking_form_submit", payload);
  }
}

export function trackServiceScrollDepth(serviceName: string, serviceSlug: string, depthPercent: number) {
  pushToDataLayer({
    event: "service_scroll_depth",
    service_name: serviceName,
    service_slug: serviceSlug,
    scroll_depth: depthPercent,
  });
}
