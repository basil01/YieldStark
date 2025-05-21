#[starknet::interface]
trait IVesuDeposit {
    fn deposit(
        ref self: ContractState,
        vtoken_address: ContractAddress,
        amount: u256,
        receiver: ContractAddress
    ) -> u256;
}

#[starknet::contract]
mod VesuDeposit {
    use starknet::{ContractAddress, get_caller_address};
    use zeroable::Zeroable;
    use integer::{U256TryIntoFelt252, U256FromFelt252};
    use debug::PrintTrait;

    #[storage]
    struct Storage {
        // Track deposits for each user
        deposits: LegacyMap::<ContractAddress, u256>,
        // Track total deposits
        total_deposits: u256,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Deposit: Deposit,
    }

    #[derive(Drop, starknet::Event)]
    struct Deposit {
        depositor: ContractAddress,
        receiver: ContractAddress,
        amount: u256,
        shares: u256,
    }

    #[external(v0)]
    impl VesuDepositImpl of super::IVesuDeposit {
        fn deposit(
            ref self: ContractState,
            vtoken_address: ContractAddress,
            amount: u256,
            receiver: ContractAddress
        ) -> u256 {
            // Get the caller's address
            let caller = get_caller_address();
            
            // Ensure amount is greater than 0
            assert(amount.is_non_zero(), 'Amount must be greater than 0');
            
            // Get the vToken contract
            let vtoken = IVTokenDispatcher { contract_address: vtoken_address };
            
            // Get the asset address from the vToken
            let asset_address = vtoken.asset();
            
            // Get the ERC20 contract for the asset
            let asset = IERC20Dispatcher { contract_address: asset_address };
            
            // Transfer the tokens from the caller to this contract
            let success = asset.transfer_from(caller, self.contract_address, amount);
            assert(success, 'Transfer failed');
            
            // Approve the vToken to spend the assets
            let success = asset.approve(vtoken_address, amount);
            assert(success, 'Approval failed');
            
            // Deposit the assets into the vToken
            let shares = vtoken.deposit(amount, receiver);
            
            // Update storage
            self.deposits.write(caller, self.deposits.read(caller) + amount);
            self.total_deposits.write(self.total_deposits.read() + amount);
            
            // Emit event
            self.emit(Deposit { 
                depositor: caller, 
                receiver, 
                amount, 
                shares 
            });
            
            shares
        }
    }
}

#[starknet::interface]
trait IVToken {
    fn asset(self: @ContractState) -> ContractAddress;
    fn deposit(
        self: @ContractState,
        assets: u256,
        receiver: ContractAddress
    ) -> u256;
}

#[starknet::interface]
trait IERC20 {
    fn transfer_from(
        self: @ContractState,
        sender: ContractAddress,
        recipient: ContractAddress,
        amount: u256
    ) -> bool;
    
    fn approve(
        self: @ContractState,
        spender: ContractAddress,
        amount: u256
    ) -> bool;
} 