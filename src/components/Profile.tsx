import { Card, CardContent } from "@/components/ui/card";
import { mockCurrentDriver } from "@/data/mockData";
import { User, MapPin, Phone, Mail, Star, Car, Calendar, Shield, FileText } from "lucide-react";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-6">
          {/* Profile Card */}
          <Card className="shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-driver-primary to-driver-secondary p-6">
              <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-8">
                <div className="h-24 w-24 rounded-full bg-white p-1 shadow-xl mb-4 md:mb-0">
                  <div className="h-full w-full rounded-full bg-driver-primary bg-opacity-10 flex items-center justify-center">
                    <User className="h-12 w-12 text-driver-primary" />
                  </div>
                </div>
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-2xl font-bold text-white">{mockCurrentDriver.name}</h1>
                  <div className="flex items-center justify-center md:justify-start mt-2 space-x-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 mr-1.5" />
                      <span className="text-white font-medium">{mockCurrentDriver.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <Car className="h-5 w-5 text-white/80 mr-1.5" />
                      <span className="text-white">Toyota Innova Crysta</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-white/80 mr-1.5" />
                      <span className="text-white">Verified Driver</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <User className="h-5 w-5 text-driver-primary mr-2" />
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-600 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-driver-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">+91 98765 43210</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-driver-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{mockCurrentDriver.name.toLowerCase().replace(' ', '.')}@example.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-driver-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">123 Driver Street, Koramangala, Bengaluru - 560034</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Information */}
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Car className="h-5 w-5 text-driver-primary mr-2" />
                  Vehicle Information
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Registration Number</p>
                      <p className="font-medium text-gray-900">KA01MX2024</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Vehicle Color</p>
                      <p className="font-medium text-gray-900">White</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-driver-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Year of Manufacture</p>
                      <p className="font-medium">2022</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600 p-3 bg-gray-50 rounded-lg">
                    <Shield className="h-5 w-5 text-driver-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Insurance Number</p>
                      <p className="font-medium">INS123456789</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600 p-3 bg-gray-50 rounded-lg">
                    <FileText className="h-5 w-5 text-driver-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Permit Number</p>
                      <p className="font-medium">PER987654321</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;