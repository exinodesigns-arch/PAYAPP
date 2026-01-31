
import React, { useState, useEffect } from 'react'; // Removed useContext
import Input from './Input';
import Dropdown from './Dropdown';
import Button from './Button';
import { PaymentPurpose, TransactionCategory, AppScreen } from '../types'; // Removed AuthContextType
import { PAYMENT_PURPOSES, TRANSACTION_CATEGORIES, MOCKED_PROJECT_TAGS, DEFAULT_USER_ID } from '../constants'; // Added DEFAULT_USER_ID
import { TransactionService } from '../services/transactionService';
import { VendorService } from '../services/vendorService';
// Removed AuthContext import
import Modal from './Modal';

interface PaymentFormProps {
  onNavigate: (screen: AppScreen) => void;
  initialUpiId?: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onNavigate, initialUpiId }) => {
  // const auth = useContext<AuthContextType | null>(AuthContext); // Removed AuthContext dependency

  const [upiId, setUpiId] = useState<string>(initialUpiId || '');
  const [vendorName, setVendorName] = useState<string>('');
  const [amount, setAmount] = useState<number | ''>(0);
  const [purpose, setPurpose] = useState<PaymentPurpose | ''>('');
  const [purposeDescription, setPurposeDescription] = useState<string>('');
  const [category, setCategory] = useState<TransactionCategory | ''>('');
  const [projectTag, setProjectTag] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [isFormValid, setIsFormValid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<'success' | 'failed' | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // if (!auth || !auth.user) { // Removed auth check
  //   return null;
  // }
  const userId = DEFAULT_USER_ID; // Use DEFAULT_USER_ID directly

  const validateField = (name: string, value: string | number | PaymentPurpose | TransactionCategory) => {
    let error = '';
    switch (name) {
      case 'upiId':
        if (!value) error = 'UPI ID is required.';
        else if (!/^[a-zA-Z0-9.\-]+@[a-zA-Z0-9.\-]+$/.test(value as string)) error = 'Invalid UPI ID format.';
        break;
      case 'vendorName':
        if (!value) error = 'Vendor Name is required.';
        break;
      case 'amount':
        if (typeof value === 'string' || value <= 0) error = 'Amount must be greater than 0.';
        break;
      case 'purpose':
        if (!value) error = 'Purpose of Payment is required.';
        break;
      case 'purposeDescription':
        if (purpose === PaymentPurpose.OTHER && !value) error = 'Description is required for "Other" purpose.';
        break;
      case 'category':
        if (!value) error = 'Category is required.';
        break;
      case 'projectTag':
        if (!value) error = 'Project / Tag Name is required.';
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === '';
  };

  useEffect(() => {
    const allFieldsValid =
      validateField('upiId', upiId) &&
      validateField('vendorName', vendorName) &&
      validateField('amount', amount) &&
      validateField('purpose', purpose) &&
      validateField('category', category) &&
      validateField('projectTag', projectTag) &&
      (purpose !== PaymentPurpose.OTHER || validateField('purposeDescription', purposeDescription));

    setIsFormValid(allFieldsValid && upiId !== '' && vendorName !== '' && amount !== '' && amount > 0 && purpose !== '' && category !== '' && projectTag !== '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upiId, vendorName, amount, purpose, purposeDescription, category, projectTag]);


  const handlePayment = async () => {
    if (!isFormValid || isProcessing) return;

    setShowConfirmation(true);
  };

  const confirmPayment = async () => {
    setShowConfirmation(false);
    setIsProcessing(true);
    setPaymentResult(null);

    try {
      const parsedAmount = typeof amount === 'number' ? amount : parseFloat(amount);
      const transaction = await TransactionService.addTransaction({
        userId, // Uses DEFAULT_USER_ID
        upiId: upiId || undefined,
        vendorName,
        purpose: purpose as PaymentPurpose,
        purposeDescription: purpose === PaymentPurpose.OTHER ? purposeDescription : undefined,
        category: category as TransactionCategory,
        projectTag,
        amount: parsedAmount,
        notes,
      });

      if (transaction.status === 'success') {
        setPaymentResult('success');
        // Optionally save vendor
        const existingVendors = await VendorService.getVendors(userId); // Uses DEFAULT_USER_ID
        if (upiId && !existingVendors.some(v => v.upiId === upiId)) {
          await VendorService.addVendor({ userId, name: vendorName, upiId }); // Uses DEFAULT_USER_ID
        } else if (upiId) {
          const vendorToUpdate = existingVendors.find(v => v.upiId === upiId);
          if (vendorToUpdate) {
            await VendorService.updateVendor({ ...vendorToUpdate, name: vendorName, lastPaid: new Date().toISOString() });
          }
        }
      } else {
        setPaymentResult('failed');
      }
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentResult('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setUpiId(initialUpiId || '');
    setVendorName('');
    setAmount('');
    setPurpose('');
    setPurposeDescription('');
    setCategory('');
    setProjectTag('');
    setNotes('');
    setPaymentResult(null);
    setErrors({});
  };

  const paymentResultModal = paymentResult && (
    <Modal
      isOpen={!!paymentResult}
      onClose={() => {
        setPaymentResult(null);
        if (paymentResult === 'success') {
          onNavigate(AppScreen.TRANSACTION_HISTORY); // Navigate to history on success
        }
        resetForm(); // Reset form always
      }}
      title={paymentResult === 'success' ? 'Payment Successful!' : 'Payment Failed'}
    >
      <div className="text-center p-4">
        {paymentResult === 'success' ? (
          <>
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Your transaction was processed successfully.</p>
          </>
        ) : (
          <>
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
              Unfortunately, your payment could not be processed. Please try again.
            </p>
          </>
        )}
        <Button onClick={() => {
          setPaymentResult(null);
          if (paymentResult === 'success') {
            onNavigate(AppScreen.TRANSACTION_HISTORY);
          }
          resetForm();
        }} className="mt-6">
          {paymentResult === 'success' ? 'View Transactions' : 'Try Again'}
        </Button>
      </div>
    </Modal>
  );

  return (
    <div className="flex-grow flex justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 relative">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Make a UPI Payment</h2>

        <form className="pb-24 overflow-y-auto max-h-[calc(100vh-180px)]" onSubmit={(e) => e.preventDefault()}>
          <Input
            id="upiId"
            label="UPI ID"
            type="text"
            placeholder="e.g., recipient@bank"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            onBlur={(e) => validateField('upiId', e.target.value)}
            error={errors.upiId}
            required
            disabled={isProcessing}
          />

          <Input
            id="vendorName"
            label="Vendor Name"
            type="text"
            placeholder="e.g., John's Groceries"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            onBlur={(e) => validateField('vendorName', e.target.value)}
            error={errors.vendorName}
            required
            disabled={isProcessing}
          />

          <Input
            id="amount"
            label="Amount (₹)"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setAmount(isNaN(val) ? '' : val);
            }}
            onBlur={(e) => validateField('amount', parseFloat(e.target.value) || 0)}
            error={errors.amount}
            required
            min="0.01"
            step="0.01"
            disabled={isProcessing}
          />

          <Dropdown
            id="purpose"
            label="Purpose of Payment"
            options={PAYMENT_PURPOSES}
            value={purpose}
            onChange={(e) => {
              setPurpose(e.target.value as PaymentPurpose);
              setPurposeDescription(''); // Clear description when purpose changes
            }}
            onBlur={(e) => validateField('purpose', e.target.value as PaymentPurpose)}
            error={errors.purpose}
            placeholder="Select purpose"
            required
            disabled={isProcessing}
          />

          {purpose === PaymentPurpose.OTHER && (
            <Input
              id="purposeDescription"
              label="Purpose Description"
              type="text"
              placeholder="e.g., Custom software development"
              value={purposeDescription}
              onChange={(e) => setPurposeDescription(e.target.value)}
              onBlur={(e) => validateField('purposeDescription', e.target.value)}
              error={errors.purposeDescription}
              required
              disabled={isProcessing}
            />
          )}

          <Dropdown
            id="category"
            label="Category"
            options={TRANSACTION_CATEGORIES}
            value={category}
            onChange={(e) => setCategory(e.target.value as TransactionCategory)}
            onBlur={(e) => validateField('category', e.target.value as TransactionCategory)}
            error={errors.category}
            placeholder="Select category"
            required
            disabled={isProcessing}
          />

          <Dropdown
            id="projectTag"
            label="Project / Tag Name"
            options={MOCKED_PROJECT_TAGS.map(tag => ({ value: tag, label: tag }))}
            value={projectTag}
            onChange={(e) => setProjectTag(e.target.value)}
            onBlur={(e) => validateField('projectTag', e.target.value)}
            error={errors.projectTag}
            placeholder="Select or enter project/tag"
            required
            disabled={isProcessing}
          />

          <Input
            id="notes"
            label="Notes / Invoice Reference (Optional)"
            type="text"
            placeholder="e.g., Invoice #INV-2023-001"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isProcessing}
          />
        </form>

        <div className="sticky bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 -mx-6 -mb-6 flex justify-center">
          <Button
            onClick={handlePayment}
            disabled={!isFormValid || isProcessing}
            loading={isProcessing}
            className="w-full max-w-xs"
            size="lg"
          >
            Pay ₹{typeof amount === 'number' ? amount.toFixed(2) : '0.00'}
          </Button>
        </div>

        {/* Confirmation Modal */}
        <Modal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          title="Confirm Payment"
        >
          <div className="p-4 text-gray-800 dark:text-gray-200">
            <p className="mb-2">You are about to pay:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Vendor:</strong> {vendorName}</li>
              <li><strong>UPI ID:</strong> {upiId}</li>
              <li><strong>Amount:</strong> ₹{typeof amount === 'number' ? amount.toFixed(2) : amount}</li>
              <li><strong>Purpose:</strong> {purpose} {purpose === PaymentPurpose.OTHER && `(${purposeDescription})`}</li>
              <li><strong>Category:</strong> {category}</li>
              <li><strong>Project/Tag:</strong> {projectTag}</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Note: This is a simulated payment. Actual UPI intent will launch on a mobile device.
            </p>
            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
                Cancel
              </Button>
              <Button onClick={confirmPayment} loading={isProcessing}>
                Confirm & Pay
              </Button>
            </div>
          </div>
        </Modal>

        {paymentResultModal}
      </div>
    </div>
  );
};

export default PaymentForm;
