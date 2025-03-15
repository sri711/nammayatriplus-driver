
import { useState } from "react";
import { Car, CheckCircle, ChevronRight, Info } from "lucide-react";
import { vehicleTypes } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const VehicleRegistration = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    registrationNumber: "",
    model: "",
    color: "",
    yearOfManufacture: "",
    insurance: "",
    permitNumber: "",
  });
  const [submitting, setSubmitting] = useState(false);
  
  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const validateStep1 = () => {
    if (!selectedType) {
      toast({
        title: "Please select a vehicle type",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };
  
  const validateStep2 = () => {
    if (!formData.registrationNumber) {
      toast({
        title: "Registration number is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.model) {
      toast({
        title: "Vehicle model is required",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };
  
  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSubmit = async () => {
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Vehicle registered successfully!",
        description: "Your vehicle details have been saved.",
      });
      setSubmitting(false);
      // Reset form or redirect
    }, 1500);
  };
  
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex-1 relative">
              <div className="flex items-center justify-center">
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center font-medium relative z-10",
                    step === num 
                      ? "bg-driver-primary border-driver-primary text-white" 
                      : step > num 
                        ? "bg-driver-success border-driver-success text-white"
                        : "bg-white border-gray-300 text-gray-500"
                  )}
                >
                  {step > num ? <CheckCircle className="w-5 h-5" /> : num}
                </div>
                <div 
                  className={cn(
                    "absolute top-5 h-1 w-full",
                    num === 3 ? "hidden" : "block",
                    step > num ? "bg-driver-success" : "bg-gray-200"
                  )}
                  style={{ right: "-50%" }}
                ></div>
              </div>
              <div className="text-center mt-2">
                <span 
                  className={cn(
                    "text-xs font-medium",
                    step >= num ? "text-driver-dark" : "text-gray-500"
                  )}
                >
                  {num === 1 ? "Vehicle Type" : num === 2 ? "Details" : "Verification"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Step 1: Select Vehicle Type */}
      {step === 1 && (
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle>Select Vehicle Type</CardTitle>
            <CardDescription>Choose the type of vehicle you will be using</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {vehicleTypes.map((type) => (
                <div 
                  key={type.id}
                  onClick={() => handleTypeSelect(type.id)}
                  className={cn(
                    "border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-driver-primary",
                    selectedType === type.id 
                      ? "border-driver-primary bg-blue-50" 
                      : "border-gray-200"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-driver-primary">
                      <Car className="h-6 w-6" />
                    </div>
                    <div className={cn(
                      "w-5 h-5 rounded-full border",
                      selectedType === type.id 
                        ? "border-driver-primary bg-driver-primary" 
                        : "border-gray-300"
                    )}>
                      {selectedType === type.id && (
                        <CheckCircle className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </div>
                  <h3 className="font-medium">{type.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {type.id === "AUTO" && "3-wheeler passenger auto"}
                    {type.id === "BIKE" && "2-wheeler for quick rides"}
                    {type.id === "CAR" && "4-wheeler for comfortable rides"}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-8">
              <Button onClick={nextStep} className="flex items-center">
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Step 2: Vehicle Details */}
      {step === 2 && (
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
            <CardDescription>Enter your vehicle information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number <span className="text-red-500">*</span></Label>
                  <Input
                    id="registrationNumber"
                    name="registrationNumber"
                    placeholder="KA 01 AB 1234"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model">Vehicle Model <span className="text-red-500">*</span></Label>
                  <Input
                    id="model"
                    name="model"
                    placeholder="e.g. Bajaj RE Compact"
                    value={formData.model}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Vehicle Color</Label>
                  <Input
                    id="color"
                    name="color"
                    placeholder="e.g. Yellow"
                    value={formData.color}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="yearOfManufacture">Year of Manufacture</Label>
                  <Input
                    id="yearOfManufacture"
                    name="yearOfManufacture"
                    placeholder="e.g. 2020"
                    value={formData.yearOfManufacture}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insurance">Insurance Number</Label>
                  <Input
                    id="insurance"
                    name="insurance"
                    placeholder="Insurance policy number"
                    value={formData.insurance}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="permitNumber">Permit Number</Label>
                  <Input
                    id="permitNumber"
                    name="permitNumber"
                    placeholder="Commercial permit number"
                    value={formData.permitNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="flex items-start p-3 bg-blue-50 rounded-lg mt-4">
                <Info className="h-5 w-5 text-driver-primary mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">
                  Please ensure all details match your vehicle documentation. Incorrect information may delay your verification.
                </p>
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep}>
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Step 3: Document Upload & Verification */}
      {step === 3 && (
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle>Verification</CardTitle>
            <CardDescription>Upload necessary documents for verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-medium">Required Documents</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex justify-between items-center p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-driver-primary bg-opacity-10 rounded-full flex items-center justify-center text-driver-primary mr-3">
                        <span className="text-xs font-medium">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Registration Certificate (RC)</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Upload vehicle RC book</p>
                      </div>
                    </div>
                    <span className="text-xs text-driver-primary font-medium">Upload</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-driver-primary bg-opacity-10 rounded-full flex items-center justify-center text-driver-primary mr-3">
                        <span className="text-xs font-medium">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Vehicle Insurance</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Upload valid insurance document</p>
                      </div>
                    </div>
                    <span className="text-xs text-driver-primary font-medium">Upload</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-driver-primary bg-opacity-10 rounded-full flex items-center justify-center text-driver-primary mr-3">
                        <span className="text-xs font-medium">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Vehicle Permit</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Upload commercial vehicle permit</p>
                      </div>
                    </div>
                    <span className="text-xs text-driver-primary font-medium">Upload</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-driver-primary bg-opacity-10 rounded-full flex items-center justify-center text-driver-primary mr-3">
                        <span className="text-xs font-medium">4</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Vehicle Photos</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Upload front and side view of vehicle</p>
                      </div>
                    </div>
                    <span className="text-xs text-driver-primary font-medium">Upload</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">Verification Notice</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Verification usually takes 24-48 hours after all documents are uploaded. 
                      You will receive a notification once your vehicle is approved.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit for Verification"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VehicleRegistration;
