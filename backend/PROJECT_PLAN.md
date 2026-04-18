# AI-Powered Hospital Appointment System – Full Workflow

## 1. Overview

This system is a multi-role healthcare platform that connects patients, doctors, and an admin with an integrated AI assistant for symptom-based doctor specialization recommendations.

The platform consists of four main components:

* Patient Portal
* Doctor Portal
* Admin Dashboard
* AI Symptom Assistant

---

## 2. User Entry & Authentication

### Landing Flow

* User lands on homepage
* Clicks “Get Started”
* Registers as:

  * Patient
  * Doctor

---

## 3. Doctor Flow

### 3.1 Doctor Onboarding

After registration, a doctor must complete onboarding:

Doctor submits:

* Professional documents
* Medical specialization
* Consultation fees
* Availability schedule

### 3.2 Pending State

* Doctor remains inactive initially
* Status: PENDING_APPROVAL

### 3.3 Admin Approval

Admin reviews:

* Documents
* Credentials
* Profile information

If approved:

* Doctor becomes ACTIVE
* Appears in patient search
* Can receive appointment requests

---

## 4. Admin System

Admin responsibilities:

### 4.1 Doctor Management

* Approve or reject doctors
* Verify uploaded documents

### 4.2 Platform Analytics

Admin can view:

* Total patients
* Total doctors
* Doctor specialization distribution
* Appointment statistics
* Revenue reports

### 4.3 Revenue Model

* 20% → Platform (admin)
* 80% → Doctor earnings

---

## 5. Patient Flow

Patients have two ways to interact with the system:

---

### 5.1 Traditional Doctor Browsing

* Patient enters Patient Portal

* Views list of approved doctors

* Filters doctors by:

  * Specialization
  * Fees
  * Other filters

* Selects doctor

* Clicks “Book Appointment”

---

### 5.2 AI Symptom Assistant (Simplified System)

#### Purpose

Patient describes symptoms in natural language, and AI suggests a relevant medical specialization.

#### Example Input

"I have chest pain and difficulty breathing"

#### AI Output

* Suggests specialization(s) like Cardiology

#### Constraints

* AI MUST only choose from predefined specialization list
* No diagnosis or treatment advice

#### Specialization List Example

* Cardiology
* Dermatology
* Neurology
* Orthopedics
* Gastroenterology
* ENT
* Pediatrics
* Psychiatry
* General Medicine
* Gynecology

#### AI Implementation

* Uses Google Gemini API
* Prompt enforces strict mapping:

  * symptoms → specialization only

#### Output Format

Preferred structured response:

```json
{
  "specializations": ["Cardiology"]
}
```

---

## 6. Appointment Booking Flow

After doctor selection (via normal or AI flow):

* Patient clicks “Book Appointment”
* Doctor receives real-time notification
* Doctor can:

  * Accept
  * Reject

---

## 7. Payment Flow (Stripe Integration)

If doctor accepts:

* Patient receives email notification
* Email contains payment link
* Patient redirected to Stripe checkout
* Patient pays consultation fee

---

## 8. Consultation Flow (Zoom Integration)

After successful payment:

* Patient is redirected to Zoom meeting link
* Doctor and patient join session
* Virtual consultation takes place

---

## 9. Post Consultation & Earnings

After appointment completion:

* Appointment marked as COMPLETED
* Revenue distribution:

  * 80% → Doctor
  * 20% → Platform

---

## 10. Doctor Dashboard

Doctors can:

* View upcoming appointments
* View past consultations
* Track monthly earnings
* Monitor total revenue
* Manage availability schedule

---

## 11. System Architecture Summary

### 11.1 Core Roles

* Patient: books and consults doctors
* Doctor: provides consultation
* Admin: manages platform and approvals

### 11.2 AI Layer (Simplified)

* Converts symptoms → specialization
* Uses Gemini API
* Strictly constrained to predefined list
* No diagnostic intelligence

---

## 12. Final System Behavior Summary

1. User registers as patient or doctor
2. Doctor is onboarded and approved by admin
3. Patient either:

   * Browses doctors manually OR
   * Uses AI symptom assistant
4. Appointment is booked
5. Doctor approves/rejects
6. Payment is done via Stripe
7. Consultation happens on Zoom
8. Revenue is split automatically
9. Doctor earns and admin monitors platform

---

## End of Document
