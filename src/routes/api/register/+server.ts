import Rsvp from '$lib/db/models/rsvp';
import { json } from '@sveltejs/kit';
import mongoose from 'mongoose';
import { Resend } from 'resend';

export async function GET({ url }) {
	try {
		const id = url.searchParams.get('id');

		if (!id) {
			return json({ error: 'Missing id' }, { status: 400 });
		}

		// Validate ObjectId
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return json({ error: 'Invalid id' }, { status: 400 });
		}

		// const rsvpInfo = await Rsvp.findById({ _id: ObjectId(id) });
		const rsvpInfo = await Rsvp.findById(id);
		const rsvpCount = await Rsvp.countDocuments();

		if (!rsvpInfo) {
			return json({ error: 'Not found' }, { status: 404 });
		}

		return json({ rsvpCount, rsvpInfo });
	} catch (e) {
		return json({ rsvpCount: 0, rsvpInfo: [] });
	}
}

export async function POST({ request }) {
	const { rsvp } = await request.json();

	// const result = await Rsvp.find({ isAccepted: true });

	// const first100 = await Rsvp.find({})
	// 	.sort({ createdAt: 1 }) // oldest first
	// 	.limit(100)
	// 	.select('_id');

	// const ids = first100.map((doc) => doc._id);

	// const result = await Rsvp.updateMany({ _id: { $in: ids } }, { $set: { isAccepted: true } });

	// console.log(result.length);
	// console.log(result.length);

	let doc = await Rsvp.findOne({ email: rsvp.email });

	if (!doc) {
		doc = await Rsvp.create(rsvp);
		// Send Email
		const resend = new Resend(process.env.RESEND_API_KEY);
		const { data, error } = await resend.emails.send({
			from: 'meetup@dagmawi.dev',
			to: [rsvp.email],
			subject: "Dagmawi Babi's Meetup",
			html: email_template
		});
	}

	return Response.json(doc, { status: 201 });
}

const email_template = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html dir="ltr" lang="en">
    <head>
      <meta content="width=device-width" name="viewport" />
      <link
        rel="preload"
        as="image"
        href="https://resend-attachments.s3.amazonaws.com/ALHDajv7fsUXwui" />
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
                                <table
                                  align="center"
                                  width="100%"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  role="presentation">
                                  <tbody style="width:100%">
                                    <tr style="width:100%">
                                      <td
                                        align="start"
                                        data-id="__react-email-column">
                                        <img
                                          alt="Promotional poster for Dogmawi Babi&#x27;s Meetup featuring a profile view of a person in a beige jacket gesturing while"
                                          height="611"
                                          src="https://resend-attachments.s3.amazonaws.com/ALHDajv7fsUXwui"
                                          style="display:block;outline:none;border:none;text-decoration:none;max-width:100%;border-radius:8px"
                                          width="489" />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <div
                                  class="font-medium"
                                  style="margin:0;padding:0">
                                  <h1
                                    style="margin:0;padding:0;font-size:2.25em;line-height:1.44em;padding-top:0.389em;font-weight:600">
                                    <span>Dagmawi Babi&#x27;s Meetup</span>
                                  </h1>
                                  <p
                                    style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                                    <span
                                      >This is an independently organized event by </span
                                    ><span><strong>Dagmawi Babi </strong></span
                                    ><span>and his </span
                                    ><span><strong>team</strong></span
                                    ><span
                                      >. The event is a yearly event organized as
                                      a thank you to all the incredible
                                      individuals, creators, event organizers,
                                      companies, and communities contributing to
                                      improve and accelerate the tech and design
                                      ecosystem.</span
                                    >
                                  </p>
                                </div>
                                <div
                                  class="font-medium"
                                  style="margin:0;padding:0">
                                  <p
                                    style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                                    <span
                                      >It&#x27;s a thank you for taking risks, for
                                      pioneering new ventures, for taking the
                                      blame, for investing so much of yourself
                                      into the benefits of everyone else, for
                                      spending months building epic things, for
                                      spending countless nights preparing events,
                                      for imagining a community that can be much
                                      better than what it is and working towards
                                      your vision.</span
                                    >
                                  </p>
                                  <p
                                    style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                                    <span><strong>January 24, 2026</strong></span
                                    ><span>
                                      - It&#x27;s gonna be a day packed full of
                                      exciting things, and impressive people like
                                      you. We&#x27;ve got </span
                                    ><span style="color:#2563EB"
                                      >tech and design talks, live podcasts,
                                      project showcases, hackathons, product
                                      launches, networking sessions</span
                                    ><span>
                                      and that doesn&#x27;t stop there... if
                                      you&#x27;re a Telegram Content Creator you
                                      get to </span
                                    ><span><strong>spend the night</strong></span
                                    ><span>
                                      there having more fun with other incredible
                                      Creators.
                                    </span>
                                  </p>
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
