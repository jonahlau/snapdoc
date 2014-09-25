/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var async = require('async');
var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Node = require('../api/node/node.model');
var Tree = require('../api/tree/tree.model');
var Contract =require('../api/contract/contract.model')

  Node.find({}).remove(function() {
    Node.create({
      //NODE 1
      num: 1,
      name: 'whichSide',
      question: 'Are you acting for the company or the consultant?',
      connections: []
    }, {
      //NODE2
        num: 2,
        name: 'clientType',
        question: 'Are you creating this for a company or an individual?',
        connections: []
    }, {
      //NODE3
        num: 3,
        name: 'clientCoName',
        question: 'What is the name of your client\'s company?',
        connections: []
    }, {
      //NODE4
        num: 4,
        name: 'whereClientCoIncorporated',
        question: 'Where is your client\'s company incorporated?',
        connections: []
    }, {
      //NODE5
        num: 5,
        name: 'personClientName',
        question: 'What is your client\'s full name?',
        connections: []
    },{
      //NODE6
        num: 6,
        name: 'jurisdiction',
        question: 'Where does your client operate his business?',
        connections: []
    }, {
      //NODE7
        num: 7,
        name: 'otherPartyType',
        question: 'Is the opposite party a company?',
        connections: []
    }, {
      //NODE8
        num: 8,
        name: 'otherPartyCoName',
        question: 'What is the name of the opposite party\'s company?',
        connections: []
    }, {
      //NODE9
        num: 9,
        name: 'otherPartyCoRep',
        question: 'What is the name of the opposite party\'s representative?',
        connections: []
    },{
      //NODE10
        num: 10,
        name: 'scopeOfWork',
        question: 'Describe the scope of work of the consultant.',
        connections: []
    },{
      //NODE11
        num: 11,
        name: 'deadline',
        question: 'When is the work due?',
        connections: []
    },{
      //NODE12
        num: 12,
        name: 'ipOwnership',
        question: 'Who will own the IP rights to the completed work?',
        connections: []
    }, {
      //NODE13
        num: 13,
        name: 'haveIpRestrictions',
        question: 'Will there be any restrictions to the license?',
        connections: []
    }, {
      //NODE14
        num: 14,
        name: 'ipRestrictions',
        question: 'What are the restrictions?',
        connections: []
    }, {
      //NODE15
        num: 15,
        name: 'rateType',
        question: 'Will the consultant be charging a fixed fee or an hourly rate?',
        connections: []
    }, {
      //NODE16
        num: 16,
        name: 'fixedAmount',
        question: 'What is the fixed fee?',
        connections: []
    },{
      //NODE17
        num: 17,
        name: 'hourlyRate',
        question: 'What is the hourlyRate?',
        connections: []
    },{
      //NODE18
        num: 18,
        name: 'paymentSchedule',
        question: 'How often will payment be made?',
        connections: []
    }, {
      //NODE19
        num: 19,
        name: 'expensesPaid',
        question: 'Will the consultant\'s expenses be reimbursed to him/her?',
        connections: []
    }, {
      //NODE20
        num: 20,
        name: 'latePenalty',
        question: 'Will the consultant be charged a penalty for failing to meet the deadline?',
        connections: []
    },{
      //NODE21
        num: 21,
        name: 'lastNode',
        question: 'Done!',
        connections: []
    },
    function(err, data) {
      Node.find({}, function(err, data) {
        var nodes = data;
        var compare = function(node1, node2) {
          if (node1.num < node2.num) {
            return -1;
          }
          if (node1.num > node2.num) {
            return 1;
          }
        };
        nodes = nodes.sort(compare);
        console.log(nodes);
        nodes[0].connect("For the company", "normal", nodes[1]);
        nodes[0].connect("For the consultant", "normal", nodes[1]);
        nodes[1].connect("A company", "normal", nodes[2]);
        nodes[1].connect("An individual", "normal", nodes[4]);
        nodes[2].connect(null, "otherwise", nodes[3]);
        nodes[3].connect(null, "otherwise", nodes[5]);
        nodes[4].connect(null, "otherwise", nodes[5]);
        nodes[5].connect(null, "otherwise", nodes[6]);
        nodes[6].connect("Yes", "normal", nodes[7]);
        nodes[6].connect("No", "normal", nodes[9])
        nodes[7].connect(null, "otherwise", nodes[8]);
        nodes[8].connect(null, "otherwise", nodes[9]);
        nodes[9].connect(null, "otherwise", nodes[10]);
        nodes[10].connect(null, "otherwise", nodes[11]);
        nodes[11].connect("The company", "normal", nodes[14]);
        nodes[11].connect("The consultant", "normal", nodes[12]);
        nodes[12].connect("Yes", "normal", nodes[13]);
        nodes[12].connect("No", "normal", nodes[14]);
        nodes[13].connect(null, "otherwise", nodes[14]);
        nodes[14].connect("Fixed rate", "normal", nodes[15]);
        nodes[14].connect("Hourly rate", "normal", nodes[16]);
        nodes[16].connect(null, "otherwise", nodes[17]);
        nodes[15].connect(null, "otherwise", nodes[17]);
        nodes[17].connect("Weekly", "normal", nodes[18]);
        nodes[17].connect("Monthly", "normal", nodes[18]);
        nodes[17].connect("At conclusion of the job", "normal", nodes[18]);
        nodes[18].connect("Yes", "normal", nodes[19]);
        nodes[18].connect("No", "normal", nodes[19]);
        nodes[19].connect("Yes", "normal", nodes[20]);
        nodes[19].connect("No", "normal", nodes[20]);
      });
    })
  });

Tree.find({}).remove(function() {
  Tree.create({
    name: "Freelance",
    template: "{{partyA}} is hiring {{partyB}} to do freelance software development work. The following sets forth the agreement between these two parties and binds them both.\n\nScope of Work\n\n{{partyB}} will do the following for {{partyA}}: {{scopeOfWork}}\n\n{{partyB}} may decline, or charge additionally for, work that {{partyB}} reasonably deems to be beyond this scope. The final deadline for completing the above work is {{deadline}}\n\nOwnership of the Work\n\nAll work produced or developed under this agreement is \"work made for hire\" to the extent applicable. {{ipOwnership}}. This assignment is conditioned on {{partyB}} being paid the full amount of this agreement.\n\nPayment\n\n{{partyA}} will pay {{partyB}} an {{rateType}} of ${{rate}}.\n\nUpon completion of the work, {{partyB}} will invoice {{partyA}} for any amount due. Payment is due within 30 days of the invoice date.\n\nAny amount not received by its due date will collect interest at 10% per month, or the legally allowable maximum if this amount exceeds it.\n\nConfidential Information\n\nAny information supplied by one party to the other marked as \"Confidential\" must be used only for the purposes of this agreement and must not be disclosed to other parties without the discloser's written consent. This does not apply to information that is publicly available or that the recipient already properly knew, developed, or received independently. When the agreement terminates, Jonathan must return to Boss co ltd any materials containing confidential information. Confidentiality obligations survive termination of this agreement.\n\nIndependent Contractor Relationship\n\n{{partyB}} is an independent contractor, not an employee or partner of {{partyA}}. {{partyB}} is solely responsible for all taxes, withholdings, insurance, and any other obligations that may apply to an independent contractor.\n\nLIMITED WARRANTY\n\n{{partyB}} WARRANTS THAT NO OBLIGATION TO A THIRD PARTY PROHIBITS {{partyB}} FROM ENTERING INTO THIS AGREEMENT, AND THAT TO {{partyB}}'S KNOWLEDGE, WORK PRODUCED UNDER THIS AGREEMENT WILL NOT VIOLATE THE INTELLECTUAL PROPERTY RIGHTS OF ANY THIRD PARTY.\n\nLIMITATION OF LIABILITY\n\nUNLESS A RESULT OF GROSS NEGLIGENCE OR WILLFUL MISCONDUCT, THE LIABILITY OF EITHER PARTY TO THE OTHER FOR ANY TYPE OF DAMAGES IS LIMITED TO THE AMOUNT OF {{partyB}}'S TOTAL FEES UNDER THIS AGREEMENT.\n\nTermination\n\nIf either party materially breaches this agreement, the non-­breaching party may terminate the agreement only by providing written notice of the breach to the breaching party. If the breaching party does not cure the breach within 5 days of receiving such notice, then the agreement is terminated except with respect to those obligations indicated as surviving termination.\n\nIf the agreement terminates for any reason other than a material uncured breach by {{partyB}}, then {{partyB}}'s prorated fees for the portion of the work completed at the time of termination become immediately due (less any fees already paid to {{partyB}}). This obligation, and any payment obligations pending at termination, survive termination.\n\nMiscellaneous\n\nThis agreement is between {{partyA}} and {{partyB}} and neither is allowed to delegate, transfer or assign it to a third party without the written consent of the other.\n\nThis is the parties’ entire agreement on this matter, superseding all previous negotiations or agreements. It can only be changed by mutual written consent.\n\nThe laws of the state of {{jursdiction}} govern this agreement and any disputes arising from it must be handled exclusively in courts in {{jurisdiction}}. The prevailing party in any dispute will be entitled to recover reasonable costs and attorneys' fees.\n\nSigning a copy of this agreement, physical or electronic, will have the same effect as signing an original."
  });
});

// User.find({}).success(function() {
//   User.create({
//     provider: 'local',
//     name: 'Test User',
//     email: 'test@test.com',
//     password: 'test'
//   }, {
//     provider: 'local',
//     role: 'admin',
//     name: 'Admin',
//     email: 'admin@admin.com',
//     password: 'admin'
//   }, function() {
//       console.log('finished populating users');
//     }
//   );
// });