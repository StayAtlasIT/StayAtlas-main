import React, { useState } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const ticketsSample = [
  { id: 1, title: 'Ticket #1: Login issue', description: 'User unable to login.' },
  { id: 2, title: 'Ticket #2: Feature request', description: 'Add dark mode.' },
  { id: 3, title: 'Ticket #3: Bug in checkout', description: 'Error on payment page.' },
  { id: 4, title: 'Ticket #4: Payment failed', description: 'Payment gateway timeout.' },
  { id: 5, title: 'Ticket #5: UI glitch', description: 'Dropdown not working on mobile.' },
];

const paymentFailuresSample = [
  { id: 'pf1', user: 'John Doe', amount: '$50', reason: 'Card declined' },
  { id: 'pf2', user: 'Jane Smith', amount: '$30', reason: 'Insufficient funds' },
  { id: 'pf3', user: 'Alex Johnson', amount: '$25', reason: 'Expired card' },
  { id: 'pf4', user: 'Mary Jones', amount: '$75', reason: 'Payment gateway timeout' },
  { id: 'pf5', user: 'Bob Brown', amount: '$40', reason: 'Suspected fraud' },
];

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 360,
  bgcolor: '#000',
  borderRadius: 16,
  boxShadow: 24,
  p: 4,
  color: '#fff',
  fontFamily: "'Inter', sans-serif",
  outline: 'none'
};

const Noti = () => {
  const [ticketsOpen, setTicketsOpen] = useState(true);
  const [failuresOpen, setFailuresOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null); // 'ticket' or 'failure'

  const toggleTickets = () => setTicketsOpen(prev => !prev);
  const toggleFailures = () => setFailuresOpen(prev => !prev);

  const handleItemClick = (item, type) => {
    setSelectedItem(item);
    setSelectedType(type);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
    setSelectedType(null);
  };

  return (
    <>
      <div className="w-[76.5vw] sm:w-[42.5vw] h-[60vh] sm:h-[50vh] bg-black rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.05)] text-white flex flex-col sm:flex-row gap-1 font-inter overflow-hidden transition-all duration-500">
        <section className="flex-1 flex flex-col bg-[#111] rounded-xl overflow-hidden shadow-inner backdrop-blur-md">
          <div
            className="cursor-pointer px-5 py-3 font-semibold text-lg flex justify-between items-center bg-black hover:bg-white/10 transition-colors"
            onClick={toggleTickets}
            role="button"
            aria-expanded={ticketsOpen}
            tabIndex={0}
            onKeyUp={e => { if (e.key === 'Enter' || e.key === ' ') toggleTickets(); }}
          >
            <span>User Tickets</span>
            <ExpandMoreIcon
              className={`transition-transform duration-300 text-xl ${ticketsOpen ? 'rotate-180 text-white' : 'text-white/50'}`}
            />
          </div>
          <div className={`flex-1 bg-black px-4 py-3 overflow-y-auto transition-all duration-300 no-scrollbar ${ticketsOpen ? 'max-h-full' : 'max-h-0 py-0 overflow-hidden'}`}>
            {ticketsSample.length === 0 ? (
              <p>No user tickets available.</p>
            ) : (
              ticketsSample.map(ticket => (
                <div
                  key={ticket.id}
                  className="bg-white/5 rounded-lg px-4 py-3 mb-3 shadow-md backdrop-blur-md cursor-pointer hover:bg-white/10 transition duration-300"
                  tabIndex={0}
                  onClick={() => handleItemClick(ticket, 'ticket')}
                  onKeyUp={e => { if (e.key === 'Enter' || e.key === ' ') handleItemClick(ticket, 'ticket'); }}
                  role="button"
                >
                  <div className="font-bold text-base">{ticket.title}</div>
                  <div className="text-sm text-white/70">{ticket.description}</div>
                </div>
              ))
            )}
          </div>
        </section>

 
        <section className="flex-1 flex flex-col bg-[#111] rounded-xl overflow-hidden shadow-inner backdrop-blur-md">
          <div
            className="cursor-pointer px-5 py-3 font-semibold text-lg flex justify-between items-center bg-black hover:bg-white/10 transition-colors"
            onClick={toggleFailures}
            role="button"
            aria-expanded={failuresOpen}
            tabIndex={0}
            onKeyUp={e => { if (e.key === 'Enter' || e.key === ' ') toggleFailures(); }}
          >
            <span>Payment Failures</span>
            <ExpandMoreIcon
              className={`transition-transform duration-300 text-xl ${failuresOpen ? 'rotate-180 text-white' : 'text-white/50'}`}
            />
          </div>
          <div className={`flex-1 bg-black px-4 py-3 overflow-y-auto transition-all duration-300 no-scrollbar ${failuresOpen ? 'max-h-full' : 'max-h-0 py-0 overflow-hidden'}`}>
            {paymentFailuresSample.length === 0 ? (
              <p>No payment failures.</p>
            ) : (
              paymentFailuresSample.map(failure => (
                <div
                  key={failure.id}
                  className="bg-white/5 rounded-lg px-4 py-3 mb-3 shadow-md backdrop-blur-md cursor-pointer hover:bg-white/10 transition duration-300"
                  tabIndex={0}
                  onClick={() => handleItemClick(failure, 'failure')}
                  onKeyUp={e => { if (e.key === 'Enter' || e.key === ' ') handleItemClick(failure, 'failure'); }}
                  role="button"
                >
                  <div className="font-semibold text-base">{failure.user} - {failure.amount}</div>
                  <div className="text-sm text-white/70">Reason: {failure.reason}</div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        closeAfterTransition
      >
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
            {selectedType === 'ticket' ? 'Ticket Details' : 'Payment Failure Details'}
          </Typography>
          {selectedItem ? (
            <>
              {selectedType === 'ticket' ? (
                <>
                  <Typography sx={{ fontWeight: 'bold' }}>{selectedItem.title}</Typography>
                  <Typography sx={{ mt: 1 }}>{selectedItem.description}</Typography>
                </>
              ) : (
                <>
                  <Typography sx={{ fontWeight: 'bold' }}>User: {selectedItem.user}</Typography>
                  <Typography>Amount: {selectedItem.amount}</Typography>
                  <Typography sx={{ mt: 1 }}>Reason: {selectedItem.reason}</Typography>
                </>
              )}
            </>
          ) : (
            <Typography>No data to display.</Typography>
          )}
          <Box sx={{ mt: 3, textAlign: 'right' }}>
            <Button variant="contained" onClick={handleCloseModal} color="primary">
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

     
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default Noti;