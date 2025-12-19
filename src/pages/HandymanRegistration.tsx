
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from '@clerk/clerk-react';
import { HandymanAPI, ClientAPI } from "@/lib/api";
import { LocationSelector } from "@/components/ui/location-selector";

const REG_STEPS = [
  "Personal Information",
  "Profile Photo",
  "Skillset & Services",
  "Professional Details",
];

const certifications = [
  { label: "NVQ Level Certificate", name: "nvq" },
  { label: "Technical / Vocational Courses Certificates", name: "techvoc" },
  { label: "Workshop Certificates", name: "workshop" },
  { label: "No formal training, but practical experience", name: "practical" },
];

const paymentMethods = [
  { label: "Cash", name: "cash" },
  { label: "Bank Transfer", name: "bank" },
  { label: "Online Payments", name: "online" },
];

// Validation functions
const validateNIC = (nic: string): { valid: boolean; message?: string } => {
  if (!nic || nic.trim() === '') {
    return { valid: false, message: 'NIC is required' };
  }
  
  const trimmedNIC = nic.trim();
  
  // Old NIC format: 9 digits + V or X
  const oldNICRegex = /^\d{9}[VvXx]$/;
  // New NIC format: 12 digits
  const newNICRegex = /^[0-9]{12}$/;
  
  if (oldNICRegex.test(trimmedNIC)) {
    return { valid: true };
  } else if (newNICRegex.test(trimmedNIC)) {
    return { valid: true };
  } else {
    return { 
      valid: false, 
      message: 'Invalid NIC format. Use old format (9 digits + V/X) or new format (12 digits)' 
    };
  }
};

const validateMobileNumber = (mobile: string): { valid: boolean; message?: string } => {
  if (!mobile || mobile.trim() === '') {
    return { valid: false, message: 'Contact number is required' };
  }
  
  const trimmedMobile = mobile.trim();
  
  // Remove spaces and dashes
  const cleanedMobile = trimmedMobile.replace(/[\s-]/g, '');
  
  // Local format: 10 digits starting with 07
  const localFormatRegex = /^07\d{8}$/;
  // International format: +947 or 947 followed by 7 more digits
  const internationalFormatRegex = /^(\+?947|947)\d{7}$/;
  
  if (localFormatRegex.test(cleanedMobile)) {
    return { valid: true };
  } else if (internationalFormatRegex.test(cleanedMobile)) {
    return { valid: true };
  } else {
    return { 
      valid: false, 
      message: 'Invalid mobile number. Use format: 07XXXXXXXX or +947XXXXXXXX' 
    };
  }
};

const StepIndicator = ({ step }: { step: number }) => (
  <div className="flex justify-center items-center mt-2 mb-8">
    {[1, 2, 3, 4].map((n, idx) => (
      <React.Fragment key={n}>
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-lg font-extrabold shadow-lg transition-all duration-300",
            step > idx
              ? "bg-gradient-to-br from-green-500 to-green-600 text-white transform scale-110"
              : step === idx
              ? "bg-gradient-to-br from-green-500 to-green-600 text-white transform scale-110 shadow-xl"
              : "bg-gray-200 text-gray-600"
          )}
        >
          {step > idx ? (
            <svg width="18" height="18" className="mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
          ) : (
            n
          )}
        </div>
        {idx < 3 && (
          <div
            className={cn(
              "h-1.5 w-12 mx-2 rounded-full transition-all duration-300",
              step > idx ? "bg-gradient-to-r from-green-500 to-green-600 shadow-md" : "bg-gray-200"
            )}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

const Step1 = ({data, onChange, clientData, nicFrontPhoto, nicBackPhoto, onNicFrontPhoto, onNicBackPhoto, nicError, mobileError}: { 
  data: any, 
  onChange: (e: ChangeEvent<HTMLInputElement>) => void,
  clientData?: any,
  nicFrontPhoto: File | null,
  nicBackPhoto: File | null,
  onNicFrontPhoto: (e: ChangeEvent<HTMLInputElement>) => void,
  onNicBackPhoto: (e: ChangeEvent<HTMLInputElement>) => void,
  nicError?: string,
  mobileError?: string,
}) => (
  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-md">
    <div className="flex items-center text-xl font-extrabold mb-6">
      <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg mr-3 shadow-lg">
        <svg width="22" className="text-white" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-8 0v2"/><circle cx="12" cy="7" r="4"/><rect width="24" height="24"/></svg>
      </div>
      <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Personal Information</span>
    </div>
    
    {/* Auto-fill notification */}
    {clientData && (
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200/50 rounded-xl shadow-md">
        <div className="flex items-center gap-2 text-blue-800 font-semibold">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Profile Information Auto-filled</span>
        </div>
        <p className="text-blue-700 text-sm mt-1">
          We've pre-filled some fields using your existing client profile. You can edit any information as needed.
        </p>
      </div>
    )}
    
    <div className="space-y-4">
      <div>
        <label className="block mb-1 text-gray-700 font-medium">
          Full Name <span className="text-red-500">*</span>
          {clientData?.name && (
            <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Auto-filled</span>
          )}
        </label>
        <input
          name="name"
          value={data.name}
          onChange={onChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 shadow-sm hover:shadow-md bg-white"
          type="text"
          placeholder="Full Name"
          autoComplete="name"
          required
        />
      </div>
      <div>
        <label className="block mb-1 text-gray-700 font-medium">
          NIC / Driving License Number <span className="text-red-500">*</span>
        </label>
        <input
          name="nic"
          value={data.nic}
          onChange={onChange}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 shadow-sm hover:shadow-md bg-white ${
            nicError ? 'border-red-500' : 'border-gray-200'
          }`}
          type="text"
          placeholder="NIC / Driving License Number (e.g., 931234567V or 199312345678)"
          required
        />
        {nicError && (
          <p className="text-xs text-red-500 mt-1">{nicError}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">Old format: 9 digits + V/X (e.g., 931234567V). New format: 12 digits (e.g., 199312345678)</p>
      </div>
      
      {/* NIC Photo Upload Section */}
      <div className="space-y-3">
        <label className="block mb-1 text-gray-700 font-medium">
          NIC Front & Back Photos <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Front Photo */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-green-400 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white">
            <label htmlFor="nic-front-upload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                {nicFrontPhoto ? (
                  <>
                    <img
                      src={URL.createObjectURL(nicFrontPhoto)}
                      alt="NIC Front preview"
                      className="h-24 w-full object-cover rounded-lg border-2 border-green-200 mb-2"
                    />
                    <span className="text-green-700 font-semibold text-sm">Front photo selected</span>
                    <span className="text-xs text-gray-500 mt-1">Click to change</span>
                  </>
                ) : (
                  <>
                    <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-600 text-center">NIC Front</p>
                    <p className="text-xs text-gray-500 mt-1">Click to upload</p>
                  </>
                )}
              </div>
            </label>
            <input
              id="nic-front-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onNicFrontPhoto}
            />
          </div>
          
          {/* Back Photo */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-green-400 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white">
            <label htmlFor="nic-back-upload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                {nicBackPhoto ? (
                  <>
                    <img
                      src={URL.createObjectURL(nicBackPhoto)}
                      alt="NIC Back preview"
                      className="h-24 w-full object-cover rounded-lg border-2 border-green-200 mb-2"
                    />
                    <span className="text-green-700 font-semibold text-sm">Back photo selected</span>
                    <span className="text-xs text-gray-500 mt-1">Click to change</span>
                  </>
                ) : (
                  <>
                    <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-600 text-center">NIC Back</p>
                    <p className="text-xs text-gray-500 mt-1">Click to upload</p>
                  </>
                )}
              </div>
            </label>
            <input
              id="nic-back-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onNicBackPhoto}
            />
          </div>
        </div>
      </div>
      
      <div>
        <label className="block mb-1 text-gray-700 font-medium">
          Contact Number <span className="text-red-500">*</span>
          {clientData?.mobileNumber && (
            <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Auto-filled</span>
          )}
        </label>
        <input
          name="contactNumber"
          value={data.contactNumber}
          onChange={onChange}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 shadow-sm hover:shadow-md bg-white ${
            mobileError ? 'border-red-500' : 'border-gray-200'
          }`}
          type="text"
          placeholder="Contact Number (e.g., 0771234567 or +94771234567)"
          autoComplete="tel"
          required
        />
        {mobileError && (
          <p className="text-xs text-red-500 mt-1">{mobileError}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">Format: 07XXXXXXXX or +947XXXXXXXX</p>
      </div>
      <div>
        <label className="block mb-1 text-gray-700 font-medium">
          Email Address <span className="text-red-500">*</span>
          {clientData?.email && (
            <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Auto-filled</span>
          )}
        </label>
        <input
          name="emailAddress"
          value={data.emailAddress}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 transition-all duration-300 shadow-sm"
          type="email"
          placeholder="Email Address"
          autoComplete="email"
          required
          readOnly
        />
        <p className="text-xs text-gray-500 mt-1">Email address is locked and cannot be changed from your client profile.</p>
      </div>
    </div>
  </div>
);

const Step2 = ({
  photo,
  onPhoto,
}: {
  photo: File | null;
  onPhoto: (e: ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-md">
    <div className="flex items-center text-xl font-extrabold mb-6">
      <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg mr-3 shadow-lg">
        <svg width="22" height="22" className="text-white" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 16v6m0 0v2m0-2h2m-2 0H8m8-2v-2a4 4 0 00-8 0v2"/>
          <circle cx="12" cy="7" r="4"/>
          <rect width="24" height="24"/>
        </svg>
      </div>
      <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Profile Photo <span className="text-red-500">*</span></span>
    </div>
    <div className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col justify-center items-center py-12 mb-4 hover:border-green-400 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white">
      {!photo ? (
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-gray-100 h-16 w-16 flex justify-center items-center mb-4">
            <svg className="text-gray-400" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 16v6m0 0v2m0-2h2m-2 0H8m8-2v-2a4 4 0 00-8 0v2"/>
              <circle cx="12" cy="7" r="4"/>
              <rect width="24" height="24"/>
            </svg>
          </div>
          <span className="text-gray-500 mb-3 text-center">Upload a clear, professional-looking photo</span>
          <span className="text-sm text-gray-400 mb-4 text-center">This will be displayed to potential clients</span>
          <label htmlFor="profile-upload" className="cursor-pointer">
            <span className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-block">
              Choose Photo
            </span>
          </label>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <img
            src={URL.createObjectURL(photo)}
            alt="Profile preview"
            className="h-28 w-28 object-cover rounded-full border-4 border-green-200 mb-4"
          />
          <span className="text-green-700 font-semibold">Photo selected successfully!</span>
          <span className="text-sm text-gray-500 mt-1 mb-3">Click to change photo</span>
          <label htmlFor="profile-upload" className="cursor-pointer">
            <span className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 inline-block text-sm">
              Change Photo
            </span>
          </label>
        </div>
      )}
      <input
        id="profile-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onPhoto}
      />
    </div>
  </div>
);

const Step3 = ({
  services,
  otherService,
  onServiceChange,
  onOtherChange,
  availableServices,
  clientData
}: {
  services: string[];
  otherService: string;
  onServiceChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onOtherChange: (e: ChangeEvent<HTMLInputElement>) => void;
  availableServices: any[];
  clientData?: any;
}) => (
  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-md">
    <div className="flex items-center text-xl font-extrabold mb-6">
      <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg mr-3 shadow-lg">
        <svg width="22" height="22" className="text-white" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
      </div>
      <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Skillset & Services Offered <span className="text-red-500">*</span></span>
    </div>
    <div className="mb-4 text-gray-600 font-medium">Select all services you can provide</div>
    <div className="grid grid-cols-1 gap-3">
      {availableServices.length > 0 ? (
        availableServices.map((service) => (
          <div key={service._id} className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-green-400 hover:shadow-md transition-all duration-300 bg-white">
            <input
              id={`skill-${service._id}`}
              type="checkbox"
              name={service._id}
              checked={services.includes(service._id)}
              onChange={onServiceChange}
              className="h-5 w-5 border-gray-400 text-green-600 focus:ring-green-500 rounded"
            />
            <label htmlFor={`skill-${service._id}`} className="ml-3 text-base font-medium text-gray-700 cursor-pointer">
              {service.name}
            </label>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-3"></div>
          <p className="text-gray-500">Loading available services...</p>
        </div>
      )}
    </div>
  </div>
);

const Step4 = ({
  data, onInputChange, certs, onCertChange,
  days, hours, onDaysChange, onHoursChange,
  pay, onPayChange,
  clientData, onLocationChange, locationInputValue, onLocationInputChange
}: {
  data: any;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  certs: string[];
  onCertChange: (e: ChangeEvent<HTMLInputElement>) => void;
  days: string[];
  hours: string;
  onDaysChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onHoursChange: (e: ChangeEvent<HTMLInputElement>) => void;
  pay: string[];
  onPayChange: (e: ChangeEvent<HTMLInputElement>) => void;
  clientData?: any;
  onLocationChange: (locationData: any) => void;
  locationInputValue: string;
  onLocationInputChange: (value: string) => void;
}) => (
  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-md space-y-6">
    {/* Experience Section */}
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-lg font-extrabold">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-1.5 rounded-lg shadow-md">
          <svg width="18" height="18" className="text-white" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-1M9 8h6M9 11h6"/></svg>
        </div>
        <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Years of Experience <span className="text-red-500">*</span></span>
      </div>
      <input
        name="experience"
        value={data.experience}
        onChange={onInputChange}
        type="number"
        min={0}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 shadow-sm hover:shadow-md bg-white"
        placeholder="e.g., 5 years"
      />
    </div>

    {/* Certifications Section */}
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-lg font-extrabold">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-1.5 rounded-lg shadow-md">
          <svg width="18" height="18" className="text-white" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="14" x="3" y="5" rx="2"/><path d="M3 7V5a2 2 0 012-2h3.5"/></svg>
        </div>
        <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Certifications / Training</span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {certifications.map(cert => (
          <div key={cert.name} className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-green-400 hover:shadow-md transition-all duration-300 bg-white">
            <input
              type="checkbox"
              id={`cert-${cert.name}`}
              name={cert.name}
              checked={certs.includes(cert.name)}
              onChange={onCertChange}
              className="h-5 w-5 border-gray-400 text-green-600 focus:ring-green-500 rounded"
            />
            <label htmlFor={`cert-${cert.name}`} className="ml-3 text-base font-medium text-gray-700 cursor-pointer">{cert.label}</label>
          </div>
        ))}
      </div>
    </div>

    {/* Certificate Upload Section */}
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-lg font-extrabold">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-1.5 rounded-lg shadow-md">
          <svg width="18" height="18" className="text-white" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
        </div>
        <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Upload Certificate</span>
      </div>
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white">
        <input
          type="file"
          id="certificate-upload"
          accept="image/*,.pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              // Directly set certificate file
              const syntheticEvent = {
                target: { name: 'certificate', value: file }
              } as unknown as ChangeEvent<HTMLInputElement>;
              onInputChange(syntheticEvent);
            }
          }}
          className="hidden"
        />
        <label htmlFor="certificate-upload" className="cursor-pointer">
          <div className="flex flex-col items-center">
            <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-600 mb-1">
              <span className="text-green-600 font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
            {data.certificate && (
              <p className="text-sm text-green-600 mt-2 font-medium">
                ✓ {typeof data.certificate === 'object' && 'name' in data.certificate ? data.certificate.name : 'Certificate uploaded'}
              </p>
            )}
          </div>
        </label>
      </div>
    </div>

      {/* Availability Section */}
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-extrabold">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-1.5 rounded-lg shadow-md">
          <svg width="18" height="18" className="text-white" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M8 6v-2h8v2"/></svg>
        </div>
        <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Working Schedule</span>
      </div>
      <p className="text-xs text-gray-500 -mt-2">Note: Your working schedule can be amended later.</p>
      
      {/* Working Days */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">Working Days</label>
        <div className="grid grid-cols-2 gap-3">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <div key={day} className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-green-400 hover:shadow-md transition-all duration-300 bg-white">
              <input
                type="checkbox"
                id={`day-${day.toLowerCase()}`}
                name="workDays"
                value={day}
                checked={days.includes(day)}
                onChange={onDaysChange}
                className="h-4 w-4 border-gray-400 text-green-600 focus:ring-green-500 rounded"
              />
              <label htmlFor={`day-${day.toLowerCase()}`} className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">{day}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Working Hours */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">Working Hours</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">Start Time</label>
            <input
              type="time"
              name="workHoursStart"
              value={hours.split('-')[0] || ''}
              onChange={onHoursChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 shadow-sm hover:shadow-md bg-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1 font-medium">End Time</label>
            <input
              type="time"
              name="workHoursEnd"
              value={hours.split('-')[1] || ''}
              onChange={onHoursChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 shadow-sm hover:shadow-md bg-white"
            />
          </div>
        </div>
      </div>
    </div>

    {/* Location Section */}
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-lg font-extrabold mb-2">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-1.5 rounded-lg shadow-md">
          <svg width="18" height="18" className="text-white" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
        <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Location <span className="text-red-500">*</span></span>
        {clientData?.location && (
          <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-semibold">Auto-filled</span>
        )}
      </div>
      <LocationSelector
        value={locationInputValue}
        onChange={onLocationChange}
        onInputChange={onLocationInputChange}
        label=""
        placeholder="Search for your city or click to set on map"
        required={true}
      />
      <p className="text-xs text-gray-500 mt-1">Start typing your city name and select from suggestions</p>
    </div>

    {/* Payment Methods Section */}
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-lg font-extrabold">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-1.5 rounded-lg shadow-md">
          <svg width="18" height="18" className="text-white" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M8 6v-2h8v2"/></svg>
        </div>
        <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Preferred Payment Methods</span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {paymentMethods.map(method => (
          <div key={method.name} className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-green-400 hover:shadow-md transition-all duration-300 bg-white">
            <input
              type="checkbox"
              id={`pay-${method.name}`}
              name={method.name}
              checked={pay.includes(method.name)}
              onChange={onPayChange}
              className="h-5 w-5 border-gray-400 text-green-600 focus:ring-green-500 rounded"
            />
            <label htmlFor={`pay-${method.name}`} className="ml-3 text-base font-medium text-gray-700 cursor-pointer">{method.label}</label>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const initialForm = {
  name: "",
  nic: "",
  contactNumber: "",
  emailAddress: "",
  experience: "",
  location: "",
};

const HandymanRegistration = () => {
  const [step, setStep] = useState(0);
  const [personal, setPersonal] = useState(initialForm);
  const [photo, setPhoto] = useState<File | null>(null);
  const [certificate, setCertificate] = useState<File | null>(null);
  const [nicFrontPhoto, setNicFrontPhoto] = useState<File | null>(null);
  const [nicBackPhoto, setNicBackPhoto] = useState<File | null>(null);
  const [services, setServices] = useState<string[]>([]);
  const [otherService, setOtherService] = useState("");
  const [certs, setCerts] = useState<string[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [hours, setHours] = useState<string>("");
  const [pay, setPay] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [isLoadingClientData, setIsLoadingClientData] = useState(true);
  const [clientData, setClientData] = useState<any>(null);
  const [nicError, setNicError] = useState<string>("");
  const [mobileError, setMobileError] = useState<string>("");
  
  // Location autocomplete states
  const [locationInputValue, setLocationInputValue] = useState("");
  const [locationCoordinates, setLocationCoordinates] = useState<{lat: number, lng: number} | null>(null);
  
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  // Redirect if user is not authenticated
  useEffect(() => {
    if (isLoaded && !user) {
      navigate('/sign-in');
    }
  }, [isLoaded, user, navigate]);

  // Fetch client data and auto-fill form
  useEffect(() => {
    const fetchClientDataAndAutoFill = async () => {
      if (!user || !isLoaded) return;
      
      try {
        setIsLoadingClientData(true);
        
        // Fetch client data from backend
        const response = await ClientAPI.getClientByUserId(user.id);
        
        if (response.success && response.data) {
          setClientData(response.data);
          
          // Auto-fill form with available client data
          const autoFilledData = {
            name: response.data.name || response.data.username || "",
            nic: "", // NIC is not stored in client profile
            contactNumber: response.data.mobileNumber || "",
            emailAddress: response.data.email || "",
            experience: "",
            location: response.data.location || "",
          };
          
          setPersonal(autoFilledData);
          
          // Also set location input value for autocomplete
          if (response.data.location) {
            setLocationInputValue(response.data.location);
          }
          
          console.log('Auto-filled form with client data:', autoFilledData);
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
        // Continue with empty form if client data fetch fails
      } finally {
        setIsLoadingClientData(false);
      }
    };

    fetchClientDataAndAutoFill();
  }, [user, isLoaded]);

  // Fetch available services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await HandymanAPI.getAvailableServices();
        if (response.success) {
          setAvailableServices(response.data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  // Show loading state while Clerk is initializing or client data is loading
  if (!isLoaded || !user || isLoadingClientData) {
    return (
      <div className="min-h-screen w-full bg-[#f6f7fa] flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">
          {!isLoaded || !user ? 'Loading...' : 'Loading your profile information...'}
        </p>
      </div>
    );
  }

  const handlePersonalChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonal({ ...personal, [name]: value });
    
    // Validate NIC in real-time
    if (name === 'nic') {
      const validation = validateNIC(value);
      if (!validation.valid) {
        setNicError(validation.message || '');
      } else {
        setNicError('');
      }
    }
    
    // Validate mobile number in real-time
    if (name === 'contactNumber') {
      const validation = validateMobileNumber(value);
      if (!validation.valid) {
        setMobileError(validation.message || '');
      } else {
        setMobileError('');
      }
    }
  };
  
  const handleNicFrontPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNicFrontPhoto(e.target.files[0]);
    }
  };
  
  const handleNicBackPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNicBackPhoto(e.target.files[0]);
    }
  };

  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setPhoto(e.target.files[0]);
  };

  const handleServiceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (checked) {
      setServices([...services, name]);
    } else {
      const filteredServices = services.filter(s => s !== name);
      setServices(filteredServices);
    }
  };

  const handleOtherServiceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtherService(e.target.value);
  };

  const handleCertChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (checked) setCerts([...certs, name]);
    else setCerts(certs.filter((c) => c !== name));
  };

  const handleDaysChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (days.includes(value)) {
      setDays(days.filter(day => day !== value));
    } else {
      setDays([...days, value]);
    }
  };

  const handleHoursChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    
    if (name === 'workHoursStart') {
      setHours(`${value}-${hours.split('-')[1] || ''}`);
    } else if (name === 'workHoursEnd') {
      setHours(`${hours.split('-')[0] || ''}-${value}`);
    }
  };

  const handlePayChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (checked) setPay([...pay, name]);
    else setPay(pay.filter((p) => p !== name));
  };

  const handleLocationChange = (locationData: any) => {
    // Update both the location string and coordinates
    setPersonal({ ...personal, location: locationData.city || locationData.address });
    setLocationInputValue(locationData.city || locationData.address);
    setLocationCoordinates({ lat: locationData.lat, lng: locationData.lng });
    
    console.log('Location selected:', {
      location: locationData.city || locationData.address,
      coordinates: { lat: locationData.lat, lng: locationData.lng }
    });
  };

  const handleLocationInputChange = (value: string) => {
    setLocationInputValue(value);
    // If user types manually without selecting, update the location string
    if (value !== personal.location) {
      setPersonal({ ...personal, location: value });
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.preventDefault(); // Prevent any form submission
    // Validate current step before proceeding
    if (step === 0) {
      if (!personal.name || !personal.nic || !personal.contactNumber || !personal.emailAddress) {
        alert("Please fill in all required fields (Name, NIC, Contact, Email)");
        return;
      }
      
      // Validate NIC
      const nicValidation = validateNIC(personal.nic);
      if (!nicValidation.valid) {
        setNicError(nicValidation.message || '');
        alert(nicValidation.message || "Please enter a valid NIC number");
        return;
      }
      
      // Validate mobile number
      const mobileValidation = validateMobileNumber(personal.contactNumber);
      if (!mobileValidation.valid) {
        setMobileError(mobileValidation.message || '');
        alert(mobileValidation.message || "Please enter a valid mobile number");
        return;
      }
      
      // Validate NIC photos
      if (!nicFrontPhoto || !nicBackPhoto) {
        alert("Please upload both front and back photos of your NIC");
        return;
      }
    } else if (step === 1) {
      if (!photo) {
        alert("Please upload a profile photo");
        return;
      }
    } else if (step === 2) {
      if (services.length === 0) {
        alert("Please select at least one service");
        return;
      }
    }
    setStep((s) => s + 1);
  };
  
  const handleBack = (e?: React.MouseEvent) => {
    if (e) e.preventDefault(); // Prevent any form submission
    setStep((s) => s - 1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Only allow submission on the final step
    if (step !== 3) {
      return;
    }
    
    // Validate required fields
    if (!personal.name || !personal.nic || !personal.contactNumber || !personal.emailAddress) {
      alert("Please fill in all required fields (Name, NIC, Contact, Email)");
      return;
    }
    
    // Validate NIC
    const nicValidation = validateNIC(personal.nic);
    if (!nicValidation.valid) {
      setNicError(nicValidation.message || '');
      alert(nicValidation.message || "Please enter a valid NIC number");
      return;
    }
    
    // Validate mobile number
    const mobileValidation = validateMobileNumber(personal.contactNumber);
    if (!mobileValidation.valid) {
      setMobileError(mobileValidation.message || '');
      alert(mobileValidation.message || "Please enter a valid mobile number");
      return;
    }
    
    // Validate NIC photos
    if (!nicFrontPhoto || !nicBackPhoto) {
      alert("Please upload both front and back photos of your NIC");
      return;
    }
    
    if (!photo) {
      alert("Please upload a profile photo");
      return;
    }
    
    if (services.length === 0) {
      alert("Please select at least one service");
      return;
    }
    
    // Validate address fields (only location is required now)
    if (!personal.location || personal.location.trim() === '') {
      alert("Please provide your location");
      return;
    }
    
    // Validate experience field
    if (!personal.experience || personal.experience.trim() === '') {
      alert("Please provide your years of experience");
      return;
    }
    
    // Set default working days and hours if not provided (matching backend behavior)
    let workingDays = days;
    let workingHours = hours;
    if (!workingDays || workingDays.length === 0) {
      workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    }
    if (!workingHours || workingHours.trim() === '') {
      workingHours = '9:00 AM - 5:00 PM';
    }
    
    // Convert arrays to strings as expected by backend
    const workingDaysString = workingDays.join(', ');
    const workingHoursArray = workingHours.split('-').map(hour => hour.trim());
    
    if (pay.length === 0) {
      alert("Please select at least one payment method");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert photo to base64 for storage
      const photoBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(photo!);
      });

      // Convert certificate to base64 if provided
      let certificateBase64: string | null = null;
      if (certificate) {
        certificateBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(certificate);
        });
      }

      // Convert NIC photos to base64
      const nicFrontBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(nicFrontPhoto!);
      });

      const nicBackBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(nicBackPhoto!);
      });

      // Prepare handyman data
      // Ensure experience is a number (can be 0)
      const experienceNum = personal.experience ? parseInt(personal.experience) : 0;
      if (isNaN(experienceNum)) {
        alert("Please provide a valid number for years of experience");
        setIsSubmitting(false);
        return;
      }

      const handymanData = {
        clerkUserId: user?.id, // Add Clerk user ID
        name: personal.name.trim(),
        nic: personal.nic.trim(),
        contactNumber: personal.contactNumber.trim(),
        emailAddress: personal.emailAddress.trim(),
        personalPhoto: photoBase64,
        certificate: certificateBase64 || undefined, // Send undefined instead of null for optional field
        nicFrontPhoto: nicFrontBase64, // Add NIC front photo
        nicBackPhoto: nicBackBase64, // Add NIC back photo
        experience: experienceNum, // Can be 0
        certifications: certs,
        services: services, // Only service IDs, no skills array
        location: personal.location.trim(), // Add location field
        coordinates: locationCoordinates || undefined, // Add coordinates for distance calculations
        availability: {
          workingDays: workingDaysString,
          workingHours: workingHoursArray.filter(hour => hour.trim() !== '').join(', '),
        },
        paymentMethod: pay.join(', '),
      };

      // Register handyman with backend
      const response = await HandymanAPI.registerHandyman(handymanData);
      
      if (response.success) {
        // Set Clerk metadata to mark user as handyman
        if (user) {
          await user.update({ 
            unsafeMetadata: { 
              ...user.unsafeMetadata, 
              userType: 'handyman',
              isHandyman: true,
              handymanId: response.data.handymanId,
            }
          });
        }
        
        // Set localStorage flag to indicate handyman registration is complete
        localStorage.setItem("fixfinder_handyman_registered", "true");
        localStorage.setItem("handyman_user_id", response.data.userId);
        
        // Show success state
        setShowSuccess(true);
        
        // Navigate to homepage after a short delay to show both dashboard buttons
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        alert(response.message || "Registration failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Show more specific error message if available
      if (error.response?.data?.message) {
        alert(`Registration failed: ${error.response.data.message}`);
      } else if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.join('\n');
        alert(`Registration failed:\n${errorMessages}`);
      } else {
        alert("There was an error completing your registration. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center py-8 px-4">
        <div className="w-full max-w-xl bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100 p-6 md:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200/20 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">Registration Successful!</h2>
              <p className="text-gray-600">Your handyman registration has been completed successfully. You can now access handyman features.</p>
              <p className="text-sm text-gray-500 mt-2">Redirecting to homepage...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100 p-6 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200/20 rounded-full blur-2xl" />
        <div className="relative z-10">
          <h2 className="text-2xl md:text-2xl font-extrabold text-center mb-2">
            <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Handyman Registration</span>
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Fields marked with <span className="text-red-500">*</span> are required
          </p>
          <StepIndicator step={step} />
        <form id="handyman-registration-form" onSubmit={handleSubmit} onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
          {step === 0 && (
            <Step1 
              data={personal} 
              onChange={handlePersonalChange} 
              clientData={clientData}
              nicFrontPhoto={nicFrontPhoto}
              nicBackPhoto={nicBackPhoto}
              onNicFrontPhoto={handleNicFrontPhoto}
              onNicBackPhoto={handleNicBackPhoto}
              nicError={nicError}
              mobileError={mobileError}
            />
          )}

          {step === 1 && (
            <Step2 photo={photo} onPhoto={handlePhoto} />
          )}

          {step === 2 && (
            <Step3
              services={services}
              otherService={otherService}
              onServiceChange={handleServiceChange}
              onOtherChange={handleOtherServiceChange}
              availableServices={availableServices}
            />
          )}

          {step === 3 && (
            <Step4
              data={{...personal, certificate}}
              onInputChange={(e) => {
                if (e.target.name === 'certificate') {
                  setCertificate(e.target.value as any);
                } else {
                  handlePersonalChange(e);
                }
              }}
              certs={certs}
              onCertChange={handleCertChange}
              days={days}
              hours={hours}
              onDaysChange={handleDaysChange}
              onHoursChange={handleHoursChange}
              pay={pay}
              onPayChange={handlePayChange}
              clientData={clientData}
              onLocationChange={handleLocationChange}
              locationInputValue={locationInputValue}
              onLocationInputChange={handleLocationInputChange}
            />
          )}
        </form>

          {/* Navigation buttons - moved outside form to prevent accidental submission */}
          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                onMouseDown={(e) => e.preventDefault()}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold shadow-md hover:bg-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </button>
            ) : (
              <span />
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                onMouseDown={(e) => e.preventDefault()}
                className="inline-flex items-center gap-2 px-7 py-2 rounded-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                form="handyman-registration-form"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-7 py-2 rounded-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandymanRegistration;
