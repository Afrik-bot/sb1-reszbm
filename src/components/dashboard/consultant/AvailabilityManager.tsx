import { useState } from 'react';
import { ConsultantProfile } from '@/types/profile';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

interface AvailabilityManagerProps {
  profile: ConsultantProfile;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => 
  `${i.toString().padStart(2, '0')}:00`
);

export default function AvailabilityManager({ profile }: AvailabilityManagerProps) {
  const [availability, setAvailability] = useState(profile.availability || {});
  const [saving, setSaving] = useState(false);

  const toggleTimeSlot = (day: string, time: string) => {
    setAvailability(prev => {
      const daySlots = prev[day] || [];
      const newSlots = daySlots.includes(time)
        ? daySlots.filter(t => t !== time)
        : [...daySlots, time].sort();
      
      return {
        ...prev,
        [day]: newSlots
      };
    });
  };

  const saveAvailability = async () => {
    if (!profile.id) return;

    setSaving(true);
    try {
      const userRef = doc(db, 'profiles', profile.id);
      await updateDoc(userRef, { availability });
    } catch (error) {
      console.error('Error saving availability:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Manage Availability</h3>
        <button
          onClick={saveAvailability}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              {DAYS.map(day => (
                <th key={day} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {TIME_SLOTS.map(time => (
              <tr key={time}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {time}
                </td>
                {DAYS.map(day => (
                  <td key={`${day}-${time}`} className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleTimeSlot(day, time)}
                      className={`w-6 h-6 rounded ${
                        (availability[day] || []).includes(time)
                          ? 'bg-blue-600'
                          : 'bg-gray-200'
                      }`}
                    >
                      <span className="sr-only">
                        Toggle {time} on {day}
                      </span>
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}