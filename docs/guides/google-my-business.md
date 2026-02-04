# Google My Business Setup & Optimization Guide

> **Purpose:** Set up and optimize Roma Mart's Google My Business profile for local search visibility  
> **Target:** All Roma Mart locations  
> **Status:** Setup Guide  
> **Last Updated:** December 2025

## 📋 Quick Reference

| Item | Current Status | Priority |
|------|----------------|----------|
| GMB Account | Not yet created | 🔴 HIGH |
| Business Type | Local Business / Convenience Store | Ready |
| Primary Location | 189-3 Wellington Street, Sarnia, ON N7T 1G6 | Ready |
| Service Areas | Sarnia, ON (expandable) | Ready |
| Hours | 24 hours (configurable per location) | Ready |
| Categories | Convenience Store, Café, ATM | Ready |
| Website | romamart.ca | Ready |

---

## 🚀 Setup Steps (Week 1)

### Step 1: Create Google My Business Account

1. Go to [Google My Business](https://www.google.com/business/)
2. Click **"Start now"** or **"Manage now"** (if auto-detected)
3. Sign in with Google Account (recommended: business email)
4. Search for existing Roma Mart listing
   - If found: **Claim existing business**
   - If not found: **Create new business listing**

### Step 2: Enter Business Information

**Business Name:**

- Enter: `Roma Mart`
- Ensure exact match with legal business name
- ⚠️ Don't add "24 hours" or other descriptors in name

**Business Type (Category):**

- Primary: `Convenience Store`
- Secondary: `Café` (for RoCafe)
- Additional: `ATM` (if standalone ATM locations)

**From:** Hover over **"More categories"** to add multiple

**Address:**

```
189-3 Wellington Street
Sarnia, ON N7T 1G6
Canada
```

**Phone Number:**

- Use main business phone from `config/company_data.js`
- Must be business line, not personal
- Test that calls go to correct department

**Website:**

- `https://romamart.ca`
- Must match domain registered elsewhere

**Service Area:**

- Type: Service area business (delivers/serves customers)
- Cities served: Sarnia, ON
- Expandable: Can add multiple neighborhoods

### Step 3: Verify Business Ownership

**Option A: Email Verification** (Fastest)

1. Google sends verification code to business email
2. Check email, click verification link
3. Business listed as verified (immediate)

**Option B: Phone Call**

1. Google calls business phone number
2. Verify verbal code with Google representative
3. Business listed as verified (immediate)

**Option C: Mail Verification** (Slowest - 1-2 weeks)

1. Google mails postcard with verification code
2. Receive postcard at business address
3. Enter code in GMB dashboard
4. ⚠️ Only use if email/phone verification fails

**Recommendation:** Use Email or Phone verification for immediate listing activation.

### Step 4: Add Business Photos

**Upload At Minimum:**

1. **Storefront photo** (200x200px, professional)
2. **Interior view** (well-lit, welcoming)
3. **Key products** (coffee, groceries, ATM)
4. **Team photo** (optional but builds trust)

**Photo Guidelines:**

- Minimum 300x400px (preferably 1200x628px for covers)
- High quality (avoid blurry, dark, or low-res)
- Recent (within last 6 months)
- Authentic (not stock photos)
- Include people when possible (human connection)

**Best Practices:**

- Feature storefront prominently (customers need to identify location)
- Show hours clearly (clock, signage)
- Include RoCafe counter (distinguishes from competitors)
- Show ATM area (if available)
- Never use competitor imagery

**Upload Process:**

1. In GMB dashboard → **"Photos"** section
2. Click **"Add photos"**
3. Upload up to 10 images initially
4. Add captions describing each (for accessibility)

### Step 5: Configure Business Hours

**Enter Hours:**

- **Monday-Sunday:** 24 hours (if applicable)
- Or specific hours per day

**Add Special Hours:**

- Holidays (Christmas, New Year, etc.)
- Extended hours (seasonal)
- Temporary closures (renovations)

**Implementation:**

- Import from `config/company_data.js`
- Format: HH:MM (24-hour format)
- Example: "00:00 - 23:59" for 24-hour operations

### Step 6: Add Business Description

**Write Compelling Description:**
(Under 750 characters)

Example:

```
Roma Mart is Sarnia's 24-hour convenience store destination. 
We offer fresh groceries, premium coffee at RoCafe, and Bitcoin ATM services. 
Family-owned since [year], we're committed to serving the Sarnia community 
with quality products and friendly service.
```

**Include:**

- What you do (convenience store)
- Key differentiators (24 hours, coffee, ATM)
- Service area (Sarnia)
- Founder story (if applicable)

---

## 🛠️ Profile Optimization (Week 1-2)

### Add Business Attributes

In GMB dashboard → **"Info"** section:

**Check these if applicable:**

- [ ] Wheelchair accessible
- [ ] Street parking available
- [ ] Accepts debit/credit
- [ ] Accepts Apple Pay / Google Pay
- [ ] Serves coffee/drinks
- [ ] Has ATM
- [ ] Open 24 hours
- [ ] Fast service
- [ ] Outdoor seating (if applicable)

### Add Products/Services

Click **"Products"** section:

**Add Each Service:**

1. **Coffee & Drinks** (RoCafe)
   - Description: "Premium specialty coffee and beverages"
   - Photo: Coffee cup image

2. **Groceries**
   - Description: "Fresh produce, snacks, beverages, household items"
   - Photo: Grocery shelves

3. **ATM Services**
   - Description: "Bitcoin ATM and traditional ATM available"
   - Photo: ATM machine

4. **Additional Services** (if applicable)
   - Lottery tickets
   - Money transfer
   - Package pickup

### Add Posts (New Feature)

GMB allows posting updates/promotions:

**First Post Ideas:**

1. "Welcome to Roma Mart Sarnia! 🎉 24-hour convenience store with premium RoCafe"
2. "Try our specialty coffee at RoCafe - open 24/7!"
3. "Bitcoin ATM now available - secure transactions anytime"

**Schedule Posts:**

- Post once per week initially
- Feature new products, seasonal items
- Announce special hours (holidays)
- Share customer testimonials

---

## 📞 Customer Engagement (Week 2-3)

### Set Up Messaging

Enable **"Google Business Messages"** (if available in Canada):

- Customers can message directly from Google
- Respond within 24 hours
- Builds trust and engagement

### Encourage Reviews

**Critical for Local SEO:**

Display at checkout or on receipt:

```
"Love Roma Mart? Leave us a Google review!
Search: Roma Mart Sarnia
⭐ Visit: g.page/romamart-sarnia
```

**Why Important:**

- 85% of customers trust reviews as much as personal recommendations
- More reviews = higher ranking in local search
- 4+ stars significantly improves visibility

**Response Strategy:**

1. **Respond to ALL reviews** (positive and negative)
2. **Positive reviews:** Thank customer, mention key service
3. **Negative reviews:** Apologize, offer solution, take offline
4. **Timeline:** Respond within 48 hours

**Response Examples:**

Positive:

```
"Thank you for the 5-star review! We love serving the Sarnia community 
with great coffee and service at Roma Mart. Come see us again soon! ☕"
```

Negative:

```
"We're sorry to hear about your experience. We take customer satisfaction 
seriously. Please contact us directly at [phone] so we can make it right."
```

---

## 📊 Monitoring & Optimization (Ongoing)

### GMB Insights Dashboard

Monitor weekly:

| Metric | What It Means | Action |
|--------|---------------|--------|
| **Search Views** | How many found you on Google | Expect 100+ weekly |
| **Website Clicks** | Clicks to romamart.ca | Link to specific pages |
| **Direction Requests** | Clicks to get directions | Parking/access matters |
| **Phone Calls** | Direct calls from profile | Have good hold music |
| **Reviews** | New customer reviews | Respond quickly |

### Review Management

**Monthly Checklist:**

- [ ] Respond to all new reviews
- [ ] Monitor 1-2 star reviews for patterns
- [ ] Fix repeated issues mentioned
- [ ] Share positive reviews on social media
- [ ] Post thank you response to helpful reviewers

**Target:** 4+ average star rating

### Post Performance

Track which posts get engagement:

- Promotional posts (sales, new items)
- Community posts (events, sponsorships)
- Service announcements (hours changes, new amenities)

Replicate high-performing content types.

---

## 🗺️ Multi-Location Strategy (Future)

If/When expanding to multiple locations:

**Option 1: Single GMB Profile**

- Current: One profile for all locations
- Pros: Easier to manage, single brand identity
- Cons: Can't track location-specific metrics
- Use if: Locations share same management/branding

**Option 2: Multiple GMB Profiles**

- One profile per location
- Pros: Track location-specific performance, local customization
- Cons: More management overhead
- Use if: Each location independent, different hours/phone

**Migration Path (if needed):**

1. Current: One main profile
2. Future: Split into location-specific profiles
3. Link all to main website
4. Each has own landing page on romamart.ca

---

## 🔍 Local Search Visibility Optimization

### NAP Consistency Audit

Ensure Name, Address, Phone matches everywhere:

**On Website:**

- ✅ Footer (centralized in `config/company_data.js`)
- ✅ Contact page
- ✅ Locations page
- ✅ Schema markup

**On Google:**

- Google My Business profile
- Google Maps
- Google Local Services Ads (if using)

**On Local Directories:**

- [ ] Yellow Pages Canada
- [ ] Yelp (claim/verify listing)
- [ ] Apple Maps (submit)
- [ ] Waze
- [ ] Local Sarnia directories

**Verification Action:**
Search "Roma Mart Sarnia" on Google Maps → Verify listed address matches config.

### Local Keyword Strategy

**For GMB Optimization:**

Use in:

- Business description
- Categories
- Posts
- Attributes

Keywords to target:

```
Primary:
- "24-hour convenience store Sarnia"
- "coffee shop Sarnia"
- "Bitcoin ATM Sarnia"
- "late night store Sarnia"

Secondary:
- "convenience store Wellington Street"
- "24-hour grocery Sarnia"
- "coffee delivery Sarnia"
- "ATM near me"
```

---

## 📱 Mobile Optimization

**GMB Mobile Experience:**

- Profile auto-optimized for mobile
- Customers search on phone → find you instantly
- Tap to call directly
- Tap to get directions
- Mobile review submission easy

**Ensure:**

- [ ] Phone number is clickable
- [ ] Address has embedded map
- [ ] Website loads fast on mobile
- [ ] Photos visible on mobile
- [ ] Hours clearly displayed

---

## 🔗 Integration with Website & GSC

### Link GMB to Search Console

1. In GSC → **Settings** → **Business Profile**
2. Select your GMB profile
3. Link confirmed

This enables:

- GSC data in GMB dashboard
- Local search performance insights
- Coordinated indexing

### Link GMB to Website

Ensure on romamart.ca:

- [ ] Footer has GMB link/button
- [ ] Schema markup references GMB
- [ ] Contact page links to profile
- [ ] "Leave us a review" CTA visible

### Link GMB to Analytics

1. In Google Analytics → **Admin** → **Data Sources**
2. Add GMB as data source
3. Track GMB clicks → Website behavior

---

## 📈 Growth Targets (3-6 Months)

| Metric | Target | Timeline |
|--------|--------|----------|
| Reviews | 50+ | 6 months |
| Average Rating | 4.3+ stars | 3 months |
| Monthly Views | 500+ | 3 months |
| Website Clicks | 50+ | 2 months |
| Direction Requests | 30+ | 2 months |

**Strategy to Hit Targets:**

1. Month 1: Complete profile setup, add 5+ photos
2. Month 2: Encourage reviews from employees/regulars
3. Month 3: Post weekly, respond to all reviews
4. Month 4-6: Optimize based on insights, maintain consistency

---

## 🚨 Common GMB Issues & Solutions

### Issue: "Suspended" or "Removed" Listing

**Causes:**

- Multiple duplicate listings
- Misleading information (hours, address)
- Spam (fake reviews)
- Violating Google policies

**Solution:**

- Contact GMB support immediately
- Verify all information is accurate
- Don't create duplicate listings
- Monitor for fake reviews

### Issue: "Restricted" Category Approval

**Cause:** Google needs more info for certain categories

**Solution:**

- Upload business license or permit
- Provide official documentation
- Wait for Google verification (2-7 days)

### Issue: "Can't Receive Verification Call"

**Solution:**

1. Try email verification again
2. Request mail verification (slower)
3. Verify through associated Google Analytics
4. Contact GMB support

### Issue: "Low Reviews Despite High Traffic"

**Solution:**

1. Add review request on receipt
2. Add "Leave a review" button on website
3. Respond to all reviews (increases engagement)
4. Post regularly (shows active business)
5. Train staff to encourage reviews at checkout

### Issue: "Negative Review is False"

**Solution:**

1. Respond professionally (don't be defensive)
2. Offer to investigate offline
3. Ask customer to contact directly
4. Never ask to remove review (violates policies)
5. Google may remove reviews that violate guidelines

---

## 📋 Weekly GMB Maintenance Checklist

Every week:

- [ ] Check GMB dashboard for new messages
- [ ] Respond to all new reviews
- [ ] Review insights (views, clicks, calls)
- [ ] Post one update if relevant
- [ ] Check for duplicate listings
- [ ] Monitor competitor profiles (best practices)

---

## 📋 Monthly GMB Optimization Checklist

Every month:

- [ ] Review performance metrics
- [ ] Update hours if seasonal changes
- [ ] Upload new photos (if available)
- [ ] Refresh description/products
- [ ] Analyze which posts got most engagement
- [ ] Check NAP consistency across web
- [ ] Encourage more reviews
- [ ] Respond to feedback from insights

---

## 🔗 Important Links

- **Google My Business:** <https://www.google.com/business/>
- **GMB Help Center:** <https://support.google.com/business>
- **GMB Training:** <https://course.bislabs.com/p/free-google-my-business-training>
- **Claim Existing Business:** <https://www.google.com/business/how-it-works/claim/>
- **Local Search Performance:** <https://support.google.com/business/answer/7091>

---

## ✅ Setup Completion Checklist

- [ ] Gmail/Google Account created
- [ ] Business listed (claimed or created)
- [ ] Ownership verified (email/phone/mail)
- [ ] Business info complete and accurate
- [ ] Photos uploaded (5+ minimum)
- [ ] Hours configured
- [ ] Categories set
- [ ] Description written
- [ ] Website linked
- [ ] Messaging enabled (if available)
- [ ] Linked to GSC
- [ ] Linked to GA4
- [ ] Posted first welcome post
- [ ] Encouraged first reviews
- [ ] Monitored insights for first week

---

## 🎯 Next Steps After Setup

1. **First 2 Weeks:** Monitor daily, respond to reviews, post content
2. **Month 1:** Establish routine, gather initial reviews
3. **Month 2-3:** Optimize based on insights, build review base
4. **Month 3+:** Maintain, monitor competitors, seasonal updates

---

**Maintained by:** Roma Mart Development Team  
**Last Updated:** December 2025  
**Status:** Ready for Implementation  
**Estimated Setup Time:** 1-2 hours  
**Ongoing Maintenance:** 15-30 min/week
