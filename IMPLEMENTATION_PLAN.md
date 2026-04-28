# Razorpay UPI QR Synchronization Fix

The issue you encountered on desktop is a common failure mode with Razorpay's widget. When a user scans the QR code via phone, Razorpay's desktop widget is supposed to detect the payment and trigger the local callback function. Occasionally, the widget fails to receive the socket event, leaving the UI hanging even though the payment was successful on the phone.

Because we do not have a server-to-server Razorpay webhook configured in your Razorpay dashboard, our database only gets updated when the frontend callback successfully runs.

To fix this **without requiring you to configure webhooks in Razorpay**, we will implement an "Active Order Polling" system.

## Proposed Changes

### 1. New API Endpoint: `check-order-status`
Create `src/app/api/razorpay/check-order-status/route.ts`.
- This endpoint will take the Razorpay `order_id` and your `assessment_id`.
- It will directly query the Razorpay server using your API keys: `razorpay.orders.fetch(order_id)`.
- If Razorpay confirms the order status is `"paid"`, our backend will proactively update the `is_unlocked = true` flag in the Supabase database.

### 2. Update `RoadmapClient`
- We will store the active `order_id` in the component state when you click "Authorize via UPI".
- While the Razorpay modal is open, your browser will silently ping the new `check-order-status` endpoint every 3 seconds.
- The exact moment Razorpay confirms the payment is "paid" (e.g., right after you complete the scan on your phone), the polling will detect it, unlock the dossier, and dissolve the paywall instantly.

## User Action Required
Please approve this plan. It requires zero configuration on your end and will make the QR code payment flow 100% reliable across all devices.
