export async function signUpForEmailList(email) {
  const body = {
    data: {
      type: "subscription",
      attributes: {
        events: {
          data: [
            {
              type: "event",
              attributes: {
                metric: {
                  data: {
                    type: "metric",
                    attributes: {
                      name: "Form submitted by profile",
                      service: "api",
                    },
                  },
                },
                profile: {
                  data: {
                    type: "profile",
                    attributes: {
                      email,
                      properties: {
                        $email: email,
                      },
                    },
                  },
                },
                properties: {
                  form_id: "SzC5tm",
                  form_version_id: 19274113,
                  page: "https://www.g59recordsmerchandise.com/",
                  device_type: "desktop",
                  $use_ip: true,
                  $is_session_activity: true,
                  $is_client_event: false,
                },
              },
              relationships: {
                form: {
                  data: {
                    id: "SzC5tm",
                    type: "form",
                  },
                },
                "form-version": {
                  data: {
                    id: 19274113,
                    type: "form-version",
                  },
                },
              },
            },
          ],
        },
        profile: {
          data: {
            type: "profile",
            attributes: {
              email,
              subscriptions: {
                email: {
                  marketing: {
                    consent: "SUBSCRIBED",
                  },
                },
              },
              properties: {
                $consent_method: "Klaviyo Form",
                $consent_form_id: "SzC5tm",
                $consent_form_version: 19274113,
                services: '{"shopify":{"source":"form"}}',
                $timezone_offset: 3,
              },
            },
          },
        },
        custom_source: "Simple email signup",
      },
      relationships: {
        list: {
          data: {
            type: "list",
            id: "UYXAnU",
          },
        },
        form: {
          data: {
            type: "form",
            id: "SzC5tm",
          },
        },
        "form-version": {
          data: {
            type: "form-version",
            id: 19274113,
          },
        },
      },
    },
  };

  await fetch(
    "https://a.klaviyo.com/client/subscriptions/?company_id=Tvwean&onsite=true",
    {
      credentials: "omit",
      headers: {
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.5",
        "x-datadome-clientid": ".keep",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json",
        "X-Klaviyo-Onsite": "1",
        "X-Klaviyo-Js-Url": "path",
        revision: "2025-01-15",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        Priority: "u=0",
      },
      body: JSON.stringify(body),
      method: "POST",
    }
  );
}

export async function e(email) {
  const response = await fetch(
    "https://a.klaviyo.com/client/subscriptions/?company_id=Tvwean&onsite=true",
    {
      credentials: "omit",
      headers: {
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.5",
        "x-datadome-clientid": ".keep",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json",
        "X-Klaviyo-Onsite": "1",
        "X-Klaviyo-Js-Url": "path",
        revision: "2025-01-15",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        Priority: "u=0",
      },
      referrer: "https://www.g59recordsmerchandise.com/",
      body: '{"data":{"type":"subscription","attributes":{"events":{"data":[{"type":"event","attributes":{"metric":{"data":{"type":"metric","attributes":{"name":"Form submitted by profile","service":"api"}}},"profile":{"data":{"type":"profile","attributes":{"email":"test@test.com","properties":{"$email":"test@test.com"}}}},"properties":{"form_id":"SzC5tm","form_version_id":19274113,"page":"https://www.g59recordsmerchandise.com/","device_type":"desktop","$use_ip":true,"$is_session_activity":true,"$is_client_event":false}},"relationships":{"form":{"data":{"id":"SzC5tm","type":"form"}},"form-version":{"data":{"id":19274113,"type":"form-version"}}}}]},"profile":{"data":{"type":"profile","attributes":{"email":"test@test.com","subscriptions":{"email":{"marketing":{"consent":"SUBSCRIBED"}}},"properties":{"$consent_method":"Klaviyo Form","$consent_form_id":"SzC5tm","$consent_form_version":19274113,"services":"{\\"shopify\\":{\\"source\\":\\"form\\"}}","$timezone_offset":3}}}},"custom_source":"Simple email signup"},"relationships":{"list":{"data":{"type":"list","id":"UYXAnU"}},"form":{"data":{"type":"form","id":"SzC5tm"}},"form-version":{"data":{"type":"form-version","id":19274113}}}}}',
      method: "POST",
      mode: "cors",
    }
  );

  const data = await response.json();

  if (data.url) {
    window.location.href = data.url;
  }
}

export async function phone(p) {
  await fetch(
    "https://a.klaviyo.com/client/subscriptions/?company_id=Tvwean&onsite=true",
    {
      credentials: "omit",
      headers: {
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.5",
        "x-datadome-clientid": ".keep",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json",
        "X-Klaviyo-Onsite": "1",
        "X-Klaviyo-Js-Url": "path",
        revision: "2025-01-15",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        Priority: "u=0",
      },
      referrer: "https://www.g59recordsmerchandise.com/",
      body: '{"data":{"type":"subscription","attributes":{"events":{"data":[{"type":"event","attributes":{"metric":{"data":{"type":"metric","attributes":{"name":"Form completed by profile","service":"api"}}},"profile":{"data":{"type":"profile","attributes":{"phone_number":"+19028356300","properties":{"$phone_number":"+19028356300"}}}},"properties":{"form_id":"SzC5tm","form_version_id":19274113,"page":"https://www.g59recordsmerchandise.com/","device_type":"desktop","$use_ip":true,"$is_session_activity":true,"$is_client_event":false}},"relationships":{"form":{"data":{"id":"SzC5tm","type":"form"}},"form-version":{"data":{"id":19274113,"type":"form-version"}}}}]},"profile":{"data":{"type":"profile","attributes":{"phone_number":"+19028356300","subscriptions":{"sms":{"marketing":{"consent":"SUBSCRIBED"}}},"properties":{"$consent_method":"Klaviyo Form","$consent_form_id":"SzC5tm","$consent_form_version":19274113,"services":"{\\"shopify\\":{\\"source\\":\\"form\\"}}","$email":"test@test.com","$timezone_offset":3}}}},"custom_source":"Simple email signup"},"relationships":{"list":{"data":{"type":"list","id":"T5Tsnw"}},"form":{"data":{"type":"form","id":"SzC5tm"}},"form-version":{"data":{"type":"form-version","id":19274113}}}}}',
      method: "POST",
      mode: "cors",
    }
  );
}
