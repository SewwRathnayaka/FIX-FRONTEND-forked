import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { AdminAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, X } from 'lucide-react';

interface CreateServiceFormProps {
  onSuccess?: () => void;
}

const CreateServiceForm = ({ onSuccess }: CreateServiceFormProps) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    baseFee: '',
    imageUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a service',
        variant: 'destructive',
      });
      return;
    }

    // Validate form
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Service name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Service description is required',
        variant: 'destructive',
      });
      return;
    }

    const baseFee = parseFloat(formData.baseFee);
    if (isNaN(baseFee) || baseFee < 0) {
      toast({
        title: 'Validation Error',
        description: 'Base fee must be a valid positive number',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    const isAdmin = user.unsafeMetadata?.admin === true || user.publicMetadata?.admin === true;

    try {
      const serviceData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        baseFee: baseFee,
        imageUrl: formData.imageUrl.trim() || undefined,
      };

      const response = await AdminAPI.createService(user.id, isAdmin, serviceData);

      if (response.success) {
        toast({
          title: 'Success',
          description: 'Service created successfully!',
        });
        
        // Reset form
        setFormData({
          name: '',
          description: '',
          baseFee: '',
          imageUrl: '',
        });
        
        setIsOpen(false);
        
        // Call success callback to refresh dashboard
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error(response.message || 'Failed to create service');
      }
    } catch (error: any) {
      console.error('Error creating service:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to create service',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg"
      >
        <Plus className="mr-2 h-4 w-4" />
        Create New Service
      </Button>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-md border-2 border-gray-100 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900">Create New Service</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsOpen(false);
              setFormData({
                name: '',
                description: '',
                baseFee: '',
                imageUrl: '',
              });
            }}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Service Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Plumbing, Electrical Work, Carpentry"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what this service includes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="baseFee">Base Fee (USD) *</Label>
            <Input
              id="baseFee"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.baseFee}
              onChange={(e) => setFormData({ ...formData, baseFee: e.target.value })}
              required
            />
            <p className="text-xs text-gray-500">This is the minimum fee for this service</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
            <p className="text-xs text-gray-500">URL to an image representing this service</p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Service
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setFormData({
                  name: '',
                  description: '',
                  baseFee: '',
                  imageUrl: '',
                });
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateServiceForm;

