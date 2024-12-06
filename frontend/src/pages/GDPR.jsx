import React from 'react';

const GDPR = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold mb-4">GDPR Information</h1>
            <p className="text-gray-700 mb-4">
                At CareNest, we are committed to protecting your personal data and your privacy. This page outlines how we collect, use, and protect your information in compliance with the General Data Protection Regulation (GDPR).
            </p>
            <h2 className="text-xl font-semibold mb-2">What is GDPR?</h2>
            <p className="text-gray-700 mb-4">
                The General Data Protection Regulation (GDPR) is a regulation in EU law on data protection and privacy. It aims to give individuals control over their personal data and to simplify the regulatory environment for international business.
            </p>
            <h2 className="text-xl font-semibold mb-2">Your Rights</h2>
            <ul className="list-disc list-inside mb-4">
                <li>The right to access your personal data.</li>
                <li>The right to rectify your personal data.</li>
                <li>The right to erase your personal data.</li>
                <li>The right to restrict processing of your personal data.</li>
                <li>The right to data portability.</li>
                <li>The right to object to processing of your personal data.</li>
            </ul>
            <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
            <p className="text-gray-700">
                If you have any questions about our GDPR compliance or your rights, please contact us at support@carenest.com.
            </p>
        </div>
    );
};

export default GDPR;
