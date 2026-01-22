import Rsvp from '$lib/db/models/rsvp';
import { json } from '@sveltejs/kit';
import mongoose from 'mongoose';
import { Resend } from 'resend';

export async function GET({ url }) {
	try {
		const email = url.searchParams.get('email');

		if (!email) {
			return json({ error: 'Missing email' }, { status: 400 });
		}

		// const rsvpInfo = await Rsvp.findById({ _id: ObjectId(id) });
		// const rsvpInfo = await Rsvp.findById(id);
		const rsvpInfo = await Rsvp.findOneAndUpdate({ email }, { isAccepted: true });

		if (!rsvpInfo) {
			return json({ error: 'Not found' }, { status: 404 });
		}

		// Send Email
		const resend = new Resend(process.env.RESEND_API_KEY);
		if (rsvpInfo) {
			// Send Email
			const resend = new Resend(process.env.RESEND_API_KEY);
			const { data, error } = await resend.emails.send({
				from: 'meetup@dagmawi.dev',
				to: [rsvpInfo.email],
				subject: "Dagmawi Babi's Meetup",
				html: acceptedTemplate
			});
		}

		return json({ rsvpInfo });
	} catch (e) {
		return json({ rsvpInfo: [] });
	}
}

const acceptedTemplate = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html dir="ltr" lang="en">
    <head>
      <meta content="width=device-width" name="viewport" />
      <link
        rel="preload"
        as="image"
        href="https://resend-attachments.s3.amazonaws.com/riiLVVTz4pumycf" />
      <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
      <meta name="x-apple-disable-message-reformatting" />
      <meta content="IE=edge" http-equiv="X-UA-Compatible" />
      <meta name="x-apple-disable-message-reformatting" />
      <meta
        content="telephone=no,address=no,email=no,date=no,url=no"
        name="format-detection" />
    </head>
    <body>
      <!--$--><!--html--><!--head-->
      <div
        style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0"
        data-skip-in-text="true">
        Join Dagmawi Babi&#x27;s Epic Meetup Event in 2026!
        <div>
           ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
        </div>
      </div>
      <!--body-->
      <table
        border="0"
        width="100%"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
        align="center">
        <tbody>
          <tr>
            <td>
              <table
                align="center"
                width="100%"
                border="0"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;font-size:1.0769230769230769em;min-height:100%;line-height:155%">
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="left"
                        width="100%"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="align:left;width:100%;padding-left:0px;padding-right:0px;line-height:155%;max-width:600px;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif">
                        <tbody>
                          <tr>
                            <td>
                              <div
                                class="flex flex-col justify-center gap-y-5 px-4 md:px-14"
                                style="margin:0;padding:0">
                                <img
                                  alt="Promotional poster for Dagmawi Babi&#x27;s Meetup event featuring a stylishly dressed man with glasses gesturing while speaking."
                                  src="https://resend-attachments.s3.amazonaws.com/riiLVVTz4pumycf"
                                  style="display:block;outline:none;border:none;text-decoration:none;max-width:100%;border-radius:8px"
                                  width="100%" />
                                <div
                                  class="font-medium"
                                  style="margin:0;padding:0">
                                  <h1
                                    style="margin:0;padding:0;font-size:2.25em;line-height:1.44em;padding-top:0.389em;font-weight:600">
                                    <span>Dagmawi Babi&#x27;s Meetup</span>
                                  </h1>
                                </div>
                                <p
                                  style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                                  <span
                                    >This email is a confirmation of your spot at
                                    the event. Follow </span
                                  ><span
                                    ><a
                                      href="https://t.me/dagmawi_babi"
                                      rel="noopener noreferrer nofollow"
                                      style="color:#0670DB;text-decoration-line:none;text-decoration:underline"
                                      target="_blank"
                                      >@Dagmawi_Babi</a
                                    ></span
                                  ><span>
                                    on all socials for updates about the event and
                                    don&#x27;t forget to bring your QR Code.
                                  </span>
                                </p>
                              </div>
                              <div
                                class="flex flex-col justify-center gap-y-5 px-4 md:px-14"
                                style="margin:0;padding:0">
                                <p
                                  style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                                  <span>Some reminders</span>
                                </p>
                                <ul
                                  style="margin:0;padding:0;padding-left:1.1em;padding-bottom:1em">
                                  <li
                                    style="margin:0;padding:0;margin-left:1em;margin-bottom:0.3em;margin-top:0.3em">
                                    <p style="margin:0;padding:0">
                                      <span
                                        >The event is at ALX Ethiopia | Lideta Hub
                                        (4th Floor)
                                      </span>
                                    </p>
                                  </li>
                                  <li
                                    style="margin:0;padding:0;margin-left:1em;margin-bottom:0.3em;margin-top:0.3em">
                                    <p style="margin:0;padding:0">
                                      <span
                                        >The doors open from 8:30am in the morning
                                        and program starts at 9:30am and ends at
                                        5pm in the evening
                                      </span>
                                    </p>
                                  </li>
                                  <li
                                    style="margin:0;padding:0;margin-left:1em;margin-bottom:0.3em;margin-top:0.3em">
                                    <p style="margin:0;padding:0">
                                      <span
                                        >Scan your QR code and confirm that
                                        you&#x27;re coming
                                      </span>
                                    </p>
                                  </li>
                                  <li
                                    style="margin:0;padding:0;margin-left:1em;margin-bottom:0.3em;margin-top:0.3em">
                                    <p style="margin:0;padding:0">
                                      <span>Don&#x27;t be late :)</span>
                                    </p>
                                  </li>
                                </ul>
                                <p
                                  style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                                  <span
                                    >You&#x27;re incredible and I can&#x27;t wait
                                    to see you in person at the event!</span
                                  >
                                </p>
                              </div>
                              <p
                                style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                                <br />
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <!--/$-->
    </body>
  </html>
`;
