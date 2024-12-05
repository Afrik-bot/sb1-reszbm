import { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { ConsultantProfile } from '@/types/profile';
import { EXPERTISE_OPTIONS } from '@/types/profile';

export default function ConsultantSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expertise, setExpertise] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [consultants, setConsultants] = useState<ConsultantProfile[]>([]);
  const [loading, setLoading] = useState(false);

  const searchConsultants = async () => {
    setLoading(true);
    try {
      let q = query(
        collection(db, 'profiles'),
        where('userType', '==', 'consultant')
      );

      if (expertise) {
        q = query(q, where('expertise', 'array-contains', expertise));
      }

      const querySnapshot = await getDocs(q);
      let results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ConsultantProfile[];

      // Filter by search term
      if (searchTerm) {
        results = results.filter(consultant =>
          consultant.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          consultant.experience.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter by price range
      if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        results = results.filter(consultant =>
          consultant.hourlyRate >= min && (max ? consultant.hourlyRate <= max : true)
        );
      }

      setConsultants(results);
    } catch (error) {
      console.error('Error searching consultants:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search consultants..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Expertise</label>
            <select
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Areas</option>
              {EXPERTISE_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price Range</label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">Any Price</option>
              <option value="0-100">$0 - $100/hr</option>
              <option value="100-200">$100 - $200/hr</option>
              <option value="200-300">$200 - $300/hr</option>
              <option value="300">$300+/hr</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={searchConsultants}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consultants.map((consultant) => (
          <div key={consultant.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                {consultant.photoURL ? (
                  <img
                    src={consultant.photoURL}
                    alt={consultant.displayName}
                    className="h-12 w-12 rounded-full"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-lg">
                      {consultant.displayName.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {consultant.displayName}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">⭐ {consultant.rating.toFixed(1)}</span>
                    <span>({consultant.reviews.length} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {consultant.expertise.map((exp) => (
                    <span
                      key={exp}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {consultant.experience}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  ${consultant.hourlyRate}/hr
                </span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}