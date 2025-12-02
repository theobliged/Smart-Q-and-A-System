"use client";
import { useRef, useState } from 'react';
import { Zap, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { scanReceipt } from '@/actions/transaction'; // Import the new action
import { toast } from 'sonner';

export default function ReceiptScanner({ onScanComplete }) {
    const fileInputRef = useRef(null);
    const [isScanning, setIsScanning] = useState(false);

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsScanning(true);
        try {
            // Call the Server Action
            const result = await scanReceipt(file); 

            if (result.success && onScanComplete) {
                toast.success("Receipt scanned successfully!");
                // Send the parsed data back to the parent TransactionForm
                onScanComplete(result.data); 
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsScanning(false);
            // Clear file input to allow rescanning the same file
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="w-full">
            <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
                disabled={isScanning}
            />
            <Button 
                variant="outline" 
                className="w-full justify-start text-gray-500 border-2 border-dashed h-12"
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanning}
            >
                {isScanning ? (
                    <>
                        <Zap className="w-5 h-5 mr-3 text-yellow-500 animate-pulse" />
                        Scanning Receipt...
                    </>
                ) : (
                    <>
                        <Upload className="w-5 h-5 mr-3" />
                        Scan Receipt with AI
                    </>
                )}
            </Button>
        </div>
    );
}